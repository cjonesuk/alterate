import { ImageReference } from "@/lib/comfyui/images";
import { Stage, Container, Sprite, useApp } from "@pixi/react";
import * as PIXI from "pixi.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Viewport } from "./viewport";
import { useImageReferenceQuery } from "@/lib/image-query";
import { useBlobObjectUrl } from "@/lib/blob";
import { useMouseFlow } from "./hooks";

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

interface ViewportStageProps {
  children: React.ReactNode | React.ReactNode[];
}

function ViewportStage({ children }: ViewportStageProps) {
  const [parentSize, setParentSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const updateParentSize = useCallback(() => {
    if (!parentRef.current) {
      return;
    }

    const size = {
      width: parentRef.current.clientWidth,
      height: parentRef.current.clientHeight,
    };

    console.log("resize to", size);
    setParentSize(size);
  }, [setParentSize]);

  useEffect(() => {
    // Initial call to set parent height
    updateParentSize();

    // Event listener for resize
    window.addEventListener("resize", updateParentSize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateParentSize);
    };
  }, [updateParentSize]);

  const ready = parentSize !== null;

  return (
    <div className="w-full h-full overflow-hidden" ref={parentRef}>
      {ready && (
        <Stage
          width={parentSize.width}
          height={parentSize.height}
          options={{
            backgroundColor: 0x202020,
            width: parentSize.width,
            height: parentSize.height,
            hello: true,
          }}
        >
          <Viewport width={parentSize.width} height={parentSize.height}>
            {children}
          </Viewport>
        </Stage>
      )}
    </div>
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
