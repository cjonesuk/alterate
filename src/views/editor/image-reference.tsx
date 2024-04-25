import { Button } from "@/components/ui/button";
import { useBlobObjectUrl } from "@/lib/blob";
import { ImageReference } from "@/lib/comfyui/images";
import { useImageReferenceQuery } from "@/lib/image-query";
import { useAlterateStore } from "@/lib/store";

interface Props {
  image: ImageReference;
}

export function ImageReferenceImage({ image }: Props) {
  const { data } = useImageReferenceQuery(image);
  const { url } = useBlobObjectUrl(data);

  if (!url) {
    return null;
  }

  return (
    <img
      key={url}
      src={url}
      alt={image.filename}
      className="rounded-md object-contain h-full w-full"
    />
  );
}

export function ImageReferencePreview({ image }: Props) {
  const { data } = useImageReferenceQuery(image);
  const { url } = useBlobObjectUrl(data);

  if (!url) {
    return null;
  }

  return (
    <div className="p-4 flex flex-col gap-2">
      <ImageReferenceImage image={image} />
      <img key={url} src={url} alt={image.filename} className="rounded-md" />
    </div>
  );
}

export function ImageReferenceCard({ image }: Props) {
  const acceptImage = useAlterateStore((store) => store.acceptImage);

  const { data } = useImageReferenceQuery(image);
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
    <div className="p-4 flex flex-col gap-2 w-96">
      <img key={url} src={url} alt={filename} className="rounded-md" />
      <div className="flex flex-row justify-start">
        <Button className="w-full" onClick={handleAcceptImage}>
          Accept
        </Button>
      </div>
    </div>
  );
}
