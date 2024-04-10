import { useCallback, useState } from "react";

export function useLiveImage() {
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
