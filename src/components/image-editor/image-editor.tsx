import { ImageReference } from "@/lib/comfyui/images";
import { Stage, Container, Sprite, useApp } from "@pixi/react";
import * as PIXI from "pixi.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Viewport, useViewport } from "./viewport";
import { useImageReferenceQuery } from "@/lib/image-query";
import { useBlobObjectUrl } from "@/lib/blob";

const brush = new PIXI.Graphics()
  .beginFill(0xffffff)
  .drawCircle(0, 0, 50)
  .endFill();

// Create a line that will interpolate the drawn points
const line = new PIXI.Graphics();

interface UseMouseFlowInput {
  onMove: (point: PIXI.Point, last: PIXI.Point | null) => void;
}

function useMouseFlow({ onMove }: UseMouseFlowInput) {
  const draggingRef = useRef(false);
  const lastDrawnPointRef = useRef<PIXI.Point | null>(null);
  const viewport = useViewport();

  const pointerMove: PIXI.FederatedEventHandler = useCallback(
    ({ global: { x, y } }) => {
      if (draggingRef.current) {
        const viewportPoint = new PIXI.Point(x, y);
        const point = viewport.toWorld(viewportPoint.x, viewportPoint.y);
        const last = lastDrawnPointRef.current;

        onMove(point, last);

        lastDrawnPointRef.current = last || new PIXI.Point();
        lastDrawnPointRef.current.set(point.x, point.y);
      }
    },
    [onMove, viewport]
  );

  const pointerDown: PIXI.FederatedEventHandler = useCallback(
    ({ global: { x, y }, ctrlKey }) => {
      if (ctrlKey) {
        return;
      }

      draggingRef.current = true;

      const viewportPoint = new PIXI.Point(x, y);
      const point = viewport.toWorld(viewportPoint.x, viewportPoint.y);

      onMove(point, null);

      lastDrawnPointRef.current = point;
    },
    [onMove, viewport]
  );

  const pointerUp: PIXI.FederatedEventHandler = useCallback(() => {
    draggingRef.current = false;
    lastDrawnPointRef.current = null;
  }, []);

  return {
    pointerMove,
    pointerDown,
    pointerUp,
  };
}

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
  const [parentWidth, setParentWidth] = useState(0);
  const [parentHeight, setParentHeight] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    // Function to update the parent div height
    const updateParentHeight = () => {
      if (!parentRef.current) {
        return;
      }

      const width = parentRef.current.clientWidth;
      const height = parentRef.current.clientHeight;

      console.log("resize to", { width, height });

      setParentWidth(width);
      setParentHeight(height);
    };

    // Initial call to set parent height
    updateParentHeight();

    // Event listener for resize
    window.addEventListener("resize", updateParentHeight);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateParentHeight);
    };
  }, []);

  const ready = parentWidth > 0 && parentHeight > 0;

  return (
    <div className="flex flex-row">
      <div className="w-full h-full overflow-hidden" ref={parentRef}>
        {ready && (
          <Stage
            width={parentWidth}
            height={parentHeight}
            options={{
              backgroundColor: 0x202020,
              width: parentWidth,
              height: parentHeight,
              hello: true,
            }}
          >
            <Viewport width={parentWidth} height={parentHeight}>
              {texture && (
                <Container x={0} y={0}>
                  <Sprite texture={texture} />
                  <PaintingLayer texture={texture} />
                </Container>
              )}
            </Viewport>
          </Stage>
        )}
      </div>
      <div className="flex flex-col gap-4 p-4">
        <Button onClick={onSave}>Save</Button>
      </div>
    </div>
  );
}
