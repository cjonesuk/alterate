import { AspectRatio } from "@/components/ui/aspect-ratio";

export function PreviewImage({ src }: { src: string | undefined | null }) {
  return (
    <div className="w-[200px] min-w-[200px] min-h-[200px] flex border-2 rounded-md">
      {src && (
        <AspectRatio ratio={16 / 16}>
          <img
            src={src}
            alt="Preview image"
            className="rounded-md object-cover"
          />
        </AspectRatio>
      )}
      {!src && (
        <p className="rounded-md flex flex-row self-center justify-center flex-grow text-xs text-foreground  ">
          None Available
        </p>
      )}
    </div>
  );
}
