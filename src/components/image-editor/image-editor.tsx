import { useBlobObjectUrl } from "@/lib/blob";
import { ImageReference } from "@/lib/comfyui/images";
import { useImageReferenceQuery } from "@/lib/image-query";
import { Stage, Container, Sprite, useApp } from "@pixi/react";
import * as PIXI from "pixi.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";

const imageSize = { width: 800, height: 600 };

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

  const pointerMove: PIXI.FederatedEventHandler = useCallback(
    ({ global: { x, y } }) => {
      if (draggingRef.current) {
        const point = new PIXI.Point(x, y);
        const last = lastDrawnPointRef.current;

        onMove(point, last);

        lastDrawnPointRef.current = last || new PIXI.Point();
        lastDrawnPointRef.current.set(x, y);
      }
    },
    [onMove]
  );

  const pointerDown: PIXI.FederatedEventHandler = useCallback(
    ({ global: { x, y } }) => {
      draggingRef.current = true;

      const point = new PIXI.Point(x, y);

      onMove(point, null);

      lastDrawnPointRef.current = point;
    },
    [onMove]
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

function PaintingLayer() {
  const app = useApp();

  const renderTexture = useMemo(() => {
    return PIXI.RenderTexture.create(imageSize);
  }, []);

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

  const { data } = useImageReferenceQuery(imageReference);
  const { url } = useBlobObjectUrl(data);

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

  return (
    <div className="flex flex-row">
      <div className="w-full h-full overflow-hidden" ref={parentRef}>
        <Stage
          width={parentWidth}
          height={parentHeight}
          options={{
            backgroundColor: "#202020",
            width: parentWidth,
            height: parentHeight,
          }}
        >
          <Container x={0} y={0}>
            {url && <Sprite source={url} />}
            <PaintingLayer />
          </Container>
        </Stage>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <Button onClick={onSave}>Save</Button>
      </div>
    </div>
  );
}
