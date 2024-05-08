import { ImageReference } from "@/lib/comfyui/images";
import { Container, Sprite, Stage, useApp } from "@pixi/react";
import * as PIXI from "pixi.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useImageReferenceQuery } from "@/lib/image-query";
import { useBlobObjectUrl } from "@/lib/blob";
import { useMouseFlow } from "./hooks";
import { Viewport } from "./viewport";

// Create a line that will interpolate the drawn points
const line = new PIXI.Graphics();

interface PaintingLayerProps {
  mask: PIXI.RenderTexture;
  brushColor: number;
  brushSize: number;
}

function PaintingLayer({ mask, brushColor, brushSize }: PaintingLayerProps) {
  const app = useApp();

  const { brush, lineStyle } = useMemo(() => {
    const brush = new PIXI.Graphics()
      .beginFill(brushColor)
      .drawCircle(0, 0, brushSize)
      .endFill();

    const lineStyle = { width: brushSize * 2, color: brushColor };

    return { brush, lineStyle };
  }, [brushColor, brushSize]);

  const mouseMove = useCallback(
    (point: PIXI.Point, last: PIXI.Point | null) => {
      brush.position.set(point.x, point.y);

      const renderOptions = {
        renderTexture: mask,
        clear: false,
        skipUpdateTransform: false,
      };

      app.renderer.render(brush, renderOptions);

      // Smooth out the drawing a little bit to make it look nicer
      // this connects the previous drawn point to the current one
      // using a line
      if (last) {
        line
          .clear()
          .lineStyle(lineStyle)
          .moveTo(last.x, last.y)
          .lineTo(point.x, point.y);

        app.renderer.render(line, renderOptions);
      }
    },
    [app, mask, brush, lineStyle]
  );

  const { pointerDown, pointerMove, pointerUp } = useMouseFlow({
    onMove: mouseMove,
  });

  return (
    <Sprite
      interactive={true}
      texture={mask}
      onpointerdown={pointerDown}
      onpointerup={pointerUp}
      pointerupoutside={pointerUp}
      pointermove={pointerMove}
    />
  );
}

interface MaskingLayerProps {
  image: PIXI.Texture;
  mask: PIXI.RenderTexture;
  brushColor: number;
  brushSize: number;
}

function MaskingLayer({
  image,
  mask,
  brushColor,
  brushSize,
}: MaskingLayerProps) {
  const app = useApp();

  const { brush, lineStyle } = useMemo(() => {
    const brush = new PIXI.Graphics()
      .beginFill(brushColor)
      .drawCircle(0, 0, brushSize)
      .endFill();

    const lineStyle = { width: brushSize * 2, color: brushColor };

    return { brush, lineStyle };
  }, [brushColor, brushSize]);

  const mouseMove = useCallback(
    (point: PIXI.Point, last: PIXI.Point | null) => {
      brush.position.set(point.x, point.y);

      const renderOptions = {
        renderTexture: mask,
        clear: false,
        skipUpdateTransform: false,
      };

      app.renderer.render(brush, renderOptions);

      // Smooth out the drawing a little bit to make it look nicer
      // this connects the previous drawn point to the current one
      // using a line
      if (last) {
        line
          .clear()
          .lineStyle(lineStyle)
          .moveTo(last.x, last.y)
          .lineTo(point.x, point.y);

        app.renderer.render(line, renderOptions);
      }
    },
    [app, mask, brush, lineStyle]
  );

  const { pointerDown, pointerMove, pointerUp } = useMouseFlow({
    onMove: mouseMove,
  });
  const { filters } = useMemo(() => {
    const negativeFilter = new PIXI.ColorMatrixFilter();
    negativeFilter.negative(false);

    return { filters: [negativeFilter] };
  }, []);

  // const { masking, filters } = useMemo(() => {
  //   const negativeFilter = new PIXI.ColorMatrixFilter();
  //   negativeFilter.negative(false);
  //  // const masking = new PIXI.Sprite(mask);

  //   return { masking, filters: [negativeFilter] };
  // }, [mask]);

  const maskRef = useRef<PIXI.Sprite>(null);

  return (
    <Container>
      <Sprite texture={mask} renderable={false} ref={maskRef} />
      <Sprite
        interactive={true}
        texture={image}
        mask={maskRef.current}
        filters={filters}
        onpointerdown={pointerDown}
        onpointerup={pointerUp}
        pointerupoutside={pointerUp}
        pointermove={pointerMove}
      />
    </Container>
  );
}

export interface ImageEditorProps {
  onSave: () => void;
  imageReference: ImageReference;
}

type ViewportSize = {
  width: number;
  height: number;
};

export function ImageEditor({ onSave, imageReference }: ImageEditorProps) {
  const result = useImageReferenceQuery(imageReference);
  const { url } = useBlobObjectUrl(result.data);

  const [texture, setTexture] = useState<PIXI.Texture | null>(null);

  const [app, setApp] = useState<PIXI.Application | null>(null);

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

  // destroy the texture when we're done?
  const renderTexture = useMemo(() => {
    if (!texture) {
      return null;
    }

    return PIXI.RenderTexture.create({
      width: texture.width,
      height: texture.height,
    });
  }, [texture]);

  const [viewportSize, setViewportSize] = useState<ViewportSize | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateParentSize = useCallback(() => {
    if (!containerRef.current) {
      return;
    }

    const size = {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    };

    console.log("Viewport resize to", size);
    setViewportSize(size);
  }, [setViewportSize]);

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

  const ready = viewportSize !== null;

  const handleSave = useCallback(async () => {
    if (!texture) {
      console.log("No texture");
      return;
    }

    if (!renderTexture) {
      console.log("No render texture");
      return;
    }

    if (!app) {
      console.log("No app");
      return;
    }

    const backgroundSprite = new PIXI.Sprite(texture);
    const maskSprite = new PIXI.Sprite(renderTexture);

    const container = new PIXI.Container();
    container.addChild(backgroundSprite);
    container.addChild(maskSprite);

    const d = await app.renderer.extract.base64(
      container,
      "image/png",
      0.92,
      new PIXI.Rectangle(0, 0, texture.width, texture.height)
    );
    window.open(d, "_blank");
  }, [texture, renderTexture, app]);

  return (
    <div className="flex flex-row">
      <div className="w-full h-full overflow-hidden" ref={containerRef}>
        {ready && (
          <Stage
            onMount={setApp}
            width={viewportSize.width}
            height={viewportSize.height}
            options={{
              backgroundColor: 0x202020,
              width: viewportSize.width,
              height: viewportSize.height,
              hello: true,
            }}
          >
            <Viewport width={viewportSize.width} height={viewportSize.height}>
              {texture && renderTexture && (
                <Container x={0} y={0}>
                  <Sprite texture={texture} />
                  <MaskingLayer
                    image={texture}
                    mask={renderTexture}
                    brushSize={50}
                    brushColor={0xffffff}
                  />
                </Container>
              )}
            </Viewport>
          </Stage>
        )}
      </div>
      <div className="flex flex-col gap-4 p-4">
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
