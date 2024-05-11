import { useQuery } from "@tanstack/react-query";
import { fetchImage, makeImageUrl } from "./comfyui/api";
import {
  EmptyImageReference,
  ImageReference,
  ImageReferenceViewOptions,
} from "./comfyui/images";
import { useAlterateStore } from "./store";
import { useMemo } from "react";

export function useImageReferenceQuery(
  image: ImageReference,
  options: ImageReferenceViewOptions = {}
) {
  const connection = useAlterateStore((store) => store.backend.connection);

  const { data } = useQuery({
    queryKey: ["image", image.filename, image.subfolder, image.type],
    enabled: connection !== null && image !== EmptyImageReference,
    queryFn: async () => {
      const data = await fetchImage(connection!, image, options);

      return new Blob([data], {
        type: "image/png",
      });
    },
  });

  return {
    data,
  };
}

export function useImageAndMaskUrls(
  imageReference: ImageReference | undefined
) {
  const connection = useAlterateStore((store) => store.backend.connection);

  if (!connection) {
    throw new Error("No connection");
  }

  const urls = useMemo(() => {
    if (!imageReference) {
      return null;
    }

    const alpha = makeImageUrl(connection, imageReference, {
      channel: "a",
      random: Math.random(),
    });

    const rgb = makeImageUrl(connection, imageReference, {
      channel: "rgb",
      random: Math.random(),
    });

    return { alpha, rgb };
  }, [connection, imageReference]);

  return urls;
}
