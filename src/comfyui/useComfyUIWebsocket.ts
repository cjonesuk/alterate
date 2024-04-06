import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { getWsUrl } from "./api";

const clientId = uuidv4();

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

export function useComfyUIWebsocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { imageUrl, updateImage } = useLiveImage();

  useEffect(() => {
    const url = getWsUrl(clientId);
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

      if (event.data instanceof ArrayBuffer) {
        console.log("Received array buffer message from ComfyUI websocket");
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
          throw new Error(
            `Unknown binary websocket message of type ${eventType}`
          );
        }
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return {
    socket,
    imageUrl,
  };
}
