import { Button } from "@/components/ui/button";
import { fetchImage } from "@/lib/comfyui/api";
import { ImageReference } from "@/lib/comfyui/images";
import { useAlterateStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface Props {
  image: ImageReference;
}

function useBlobObjectUrl(blob: Blob | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!blob) {
      setUrl(null);
      return;
    }

    const url = URL.createObjectURL(blob);
    setUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [blob]);

  return { url };
}

export function ImageReferenceCard({ image }: Props) {
  const connection = useAlterateStore((store) => store.backend.connection);
  const acceptImage = useAlterateStore((store) => store.acceptImage);

  const { data } = useQuery({
    queryKey: ["image", image.filename, image.subfolder, image.type],
    enabled: connection !== null,
    queryFn: async () => {
      const data = await fetchImage(connection!, image);

      return new Blob([data], {
        type: "image/png",
      });
    },
  });

  const { url } = useBlobObjectUrl(data);

  if (!url) {
    return null;
  }

  const filename = image.filename;

  const handleAcceptImage = () => {
    if (!data) return;

    acceptImage(image, data);
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      <img key={url} src={url} alt={filename} />
      <div className="flex flex-row justify-end">
        <Button onClick={handleAcceptImage}>Accept</Button>
      </div>
    </div>
  );
}
