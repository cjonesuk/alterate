import { useQuery } from "@tanstack/react-query";
import { fetchImage } from "./comfyui/api";
import {
  EmptyImageReference,
  ImageReference,
  ImageReferenceViewOptions,
} from "./comfyui/images";
import { useAlterateStore } from "./store";

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
