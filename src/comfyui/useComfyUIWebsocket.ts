import { useEffect, useState } from "react";

import { getWsUrl } from "./api";
import { useStatus } from "./useStatus";
import { useLiveImage } from "./useLiveImage";
import { WebsocketMessage } from "./types/websocket";

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
          updateProgress(
            message.data.prompt_id,
            message.data.value,
            message.data.max
          );
          return;
        }

        if (message.type === "status") {
          updateQueueLength(message.data.status.exec_info.queue_remaining);
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
            console.log("Execution complete");
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

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [updateImage, updateProgress, updateQueueLength]);

  useEffect(() => {
    console.log("Polling for history");
  }, []);

  return {
    socket,
    imageUrl,
    progress,
    queue,
  };
}
