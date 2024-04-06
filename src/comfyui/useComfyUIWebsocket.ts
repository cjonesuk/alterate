import { useCallback, useEffect, useState } from "react";

import { getWsUrl } from "./api";
import { useStatus } from "./useStatus";

function useLiveImage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const updateImage = useCallback(
    (blob: Blob) => {
      setImageUrl((oldUrl) => {
        if (oldUrl) {
          URL.revokeObjectURL(oldUrl);
        }

        return URL.createObjectURL(blob);
      });
    },
    [setImageUrl]
  );

  return { imageUrl, updateImage };
}

interface ProgressMessage {
  type: "progress";
  data: {
    value: number;
    max: number;
    prompt_id: string;
  };
}

interface StatusMessage {
  type: "status";
  data: {
    status: {
      exec_info: {
        queue_remaining: number;
      };
    };
  };
}

interface ExecutionStartedMessage {
  type: "execution_started";
  data: {
    prompt_id: string;
  };
}

interface ExecutingMessage {
  type: "executing";
  data: {
    node: string;
    prompt_id: string;
  };
}

interface ExecutedMessage {
  type: "executed";
  data: {
    node: string | null;
    prompt_id: string;
  };
}

interface ExecutionCachedMessage {
  type: "execution_cached";
  data: {
    nodes: string[];
    prompt_id: string;
  };
}

type WebsocketMessage =
  | ProgressMessage
  | StatusMessage
  | ExecutionStartedMessage
  | ExecutingMessage
  | ExecutedMessage
  | ExecutionCachedMessage;

export function useComfyUIWebsocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { updateProgress, updateQueueLength, progress, queue } = useStatus();
  const { imageUrl, updateImage } = useLiveImage();

  useEffect(() => {
    const url = getWsUrl();
    const ws = new WebSocket(url);
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      console.log("Connected to ComfyUI websocket");
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

          updateImage(imageBlob);
        } else {
          console.error("Unknown binary websocket message of type", eventType);
        }

        return;
      }

      if (typeof data === "string") {
        console.log("Received string message from ComfyUI websocket", data);
        const message = JSON.parse(data as string) as WebsocketMessage;

        if (message.type === "progress") {
          updateProgress(message.data.value, message.data.max);
          return;
        }

        if (message.type === "status") {
          updateQueueLength(message.data.status.exec_info.queue_remaining);
          return;
        }

        console.error("Unknown websocket message", message);
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [updateImage, updateProgress, updateQueueLength]);

  return {
    socket,
    imageUrl,
    progress,
    queue,
  };
}
