import { ImageReference } from "@/lib/comfyui/images";
import { Container, Sprite, useApp } from "@pixi/react";
import * as PIXI from "pixi.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { useImageReferenceQuery } from "@/lib/image-query";
import { useBlobObjectUrl } from "@/lib/blob";
import { useMouseFlow } from "./hooks";
import { ViewportStage } from "./viewport-stage";

const brush = new PIXI.Graphics()
  .beginFill(0xffffff)
  .drawCircle(0, 0, 50)
  .endFill();

// Create a line that will interpolate the drawn points
const line = new PIXI.Graphics();

function PaintingLayer({ texture }: { texture: PIXI.Texture }) {
  const app = useApp();

  const renderTexture = useMemo(() => {
    return PIXI.RenderTexture.create({
      width: texture.width,
      height: texture.height,
    });
  }, [texture]);

  const mouseMove = useCallback(
    (point: PIXI.Point, last: PIXI.Point | null) => {
      brush.position.set(point.x, point.y);

      app.renderer.render(brush, {
        renderTexture,
        clear: false,
        skipUpdateTransform: false,
      });

      // Smooth out the drawing a little bit to make it look nicer
      // this connects the previous drawn point to the current one
      // using a line
      if (last) {
        line
          .clear()
          .lineStyle({ width: 100, color: 0xffffff })
          .moveTo(last.x, last.y)
          .lineTo(point.x, point.y);

        app.renderer.render(line, {
          renderTexture,
          clear: false,
          skipUpdateTransform: false,
        });
      }
    },
    [app, renderTexture]
  );

  const { pointerDown, pointerMove, pointerUp } = useMouseFlow({
    onMove: mouseMove,
  });

  return (
    <Sprite
      interactive={true}
      texture={renderTexture}
      onpointerdown={pointerDown}
      onpointerup={pointerUp}
      pointerupoutside={pointerUp}
      pointermove={pointerMove}
    />
  );
}

export interface ImageEditorProps {
  onSave: () => void;
  imageReference: ImageReference;
}

export function ImageEditor({ onSave, imageReference }: ImageEditorProps) {
  const result = useImageReferenceQuery(imageReference);
  const { url } = useBlobObjectUrl(result.data);

  const [texture, setTexture] = useState<PIXI.Texture | null>(null);

  useEffect(() => {
    if (!url) {
      return;
    }

    const texture = PIXI.Texture.from(url);
    texture.on("update", () => {
      console.log("loaded", { valid: texture.valid });

      if (texture.valid) {
        setTexture(texture);
      }
    });
  }, [url]);

  return (
    <div className="flex flex-row">
      <ViewportStage>
        {texture && (
          <Container x={0} y={0}>
            <Sprite texture={texture} />
            <PaintingLayer texture={texture} />
          </Container>
        )}
      </ViewportStage>
      <div className="flex flex-col gap-4 p-4">
        <Button onClick={onSave}>Save</Button>
      </div>
    </div>
  );
}
