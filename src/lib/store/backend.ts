import { fetchPromptResult, fetchObjectInfo } from "@/lib/comfyui/api";
import { WebsocketMessage } from "@/lib/comfyui/websocket";
import { mapObjectInfo } from "@/lib/definition-mapping";

import { v4 as uuidv4 } from "uuid";
import {
  ConnectionDetails,
  ImmerStateCreator,
  BackendPart,
  BackendState,
  AlterateState,
} from "./types";

function formatWebsocketUrl({
  machineName,
  port,
  clientId,
}: ConnectionDetails): string {
  return `ws://${machineName}:${port}/ws?clientId=${clientId}`;
}

function formatHttpUrl(
  { machineName, port }: ConnectionDetails,
  endpoint?: string
): string {
  if (endpoint) {
    return `http://${machineName}:${port}/${endpoint}`;
  }

  return `http://${machineName}:${port}`;
}

const defaultBackendState: BackendState = {
  connection: null,
  websocket: null,
  queue: {
    length: 0,
  },
  progress: {
    promptId: null,
    step: 0,
    steps: 0,
    ratio: 0,
    percentage: 0,
  },
  execution: {
    promptId: "",
    nodeId: "",
  },
  liveImageUrl: null,
  definitions: null,
};

const clientId = uuidv4();

const defaultComfyUiTarget = {
  machineName: "localhost",
  port: 8188,
  clientId,
};

export const createBackendPart: ImmerStateCreator<
  AlterateState,
  BackendPart
> = (set, get) => ({
  backend: defaultBackendState,

  connectToDefault: () => {
    get().connect(defaultComfyUiTarget);
  },

  connect: (details: ConnectionDetails) => {
    const existingSocket = get().backend.websocket;
    if (existingSocket) {
      existingSocket.close();
    }

    const url = formatWebsocketUrl(details);
    const ws = new WebSocket(url);
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      console.log("Connected to ComfyUI websocket");

      get()
        .refreshDefinitions()
        .then(() => {
          console.log("Definitions refreshed");
        });
    };

    ws.onclose = () => {
      console.log("Disconnected from ComfyUI websocket");

      // TODO: reconnect
    };

    ws.onmessage = (event) => {
      console.log("Received message from ComfyUI websocket", event.data);

      const data = event.data;

      if (data instanceof ArrayBuffer) {
        const view = new DataView(event.data);
        const eventType = view.getUint32(0);
        const buffer = event.data.slice(4);
        if (eventType === 1) {
          const view2 = new DataView(event.data);
          const imageType = view2.getUint32(0);
          let imageMime;
          switch (imageType) {
            case 1:
            default:
              imageMime = "image/jpeg";
              break;
            case 2:
              imageMime = "image/png";
          }
          const imageBlob = new Blob([buffer.slice(4)], { type: imageMime });

          get().updateLiveImage(imageBlob);
        } else {
          console.error("Unknown binary websocket message of type", eventType);
        }

        return;
      }

      if (typeof data === "string") {
        console.log("Received string message from ComfyUI websocket", data);
        const message = JSON.parse(data as string) as WebsocketMessage;

        if (message.type === "progress") {
          get().updateProgress(
            message.data.prompt_id,
            message.data.value,
            message.data.max
          );
          return;
        }

        if (message.type === "status") {
          get().updateQueueLength(
            message.data.status.exec_info.queue_remaining
          );
          return;
        }

        if (message.type === "execution_cached") {
          console.log("Execution cached", message.data.nodes);
          return;
        }

        if (message.type === "execution_started") {
          console.log("Execution started", message.data.prompt_id);
          return;
        }

        if (message.type === "executing") {
          console.log("Executing node", message.data.node);

          if (message.data.node === null) {
            get().promptCompleted(message.data.prompt_id);
          }

          return;
        }

        if (message.type === "executed") {
          console.log("Executed node", message.data.node);
          return;
        }

        console.error("Unknown websocket message", message);
      }
    };

    set((state) => {
      state.backend.connection = details;
      state.backend.websocket = ws;
    });
  },

  updateProgress: (promptId: string, step: number, steps: number) => {
    set((state) => {
      const ratio = steps > 0 ? step / steps : 0;
      state.backend.progress = {
        promptId,
        step,
        steps,
        ratio,
        percentage: steps > 0 ? ratio * 100 : 0,
      };
    });
  },

  updateQueueLength: (input: number) => {
    set((state) => {
      state.backend.queue.length = input;
    });
  },

  updateLiveImage: (imageBlob: Blob) => {
    set((state) => {
      const oldUrl = state.backend.liveImageUrl;
      if (oldUrl) {
        URL.revokeObjectURL(oldUrl);
      }

      state.backend.liveImageUrl = URL.createObjectURL(imageBlob);
    });
  },

  sendPrompt: async (workflow: unknown) => {
    const connection = get().backend.connection;

    if (connection === null) {
      console.error("No connection details available");
      return;
    }

    const url = formatHttpUrl(connection, "prompt");
    const payload = JSON.stringify({
      prompt: workflow,
      client_id: connection.clientId,
    });

    const res = await fetch(url, {
      method: "POST",
      body: payload,
    });

    const resp = await res.json();

    return resp.prompt_id;
  },

  refreshDefinitions: async () => {
    const connection = get().backend.connection;
    if (!connection) {
      console.error("No connection details available");
      return;
    }

    const objectInfo = await fetchObjectInfo(connection);
    const definitions = mapObjectInfo(objectInfo);

    set((state) => {
      state.backend.definitions = definitions;
    });
  },

  promptCompleted: async (promptId: string) => {
    console.log("Prompt completed", promptId);

    const connection = get().backend.connection;

    if (!connection) {
      console.error("No connection details available");
      return;
    }

    const result = await fetchPromptResult(connection, promptId);

    get().notifyPromptCompleted(result[promptId]);
  },
});
