import { ImageReference } from "@/lib/comfyui/images";
import { Container, Sprite, Stage, useApp, withPixiApp } from "@pixi/react";
import * as PIXI from "pixi.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useImageReferenceQuery } from "@/lib/image-query";
import { useBlobObjectUrl } from "@/lib/blob";
import { useMouseFlow } from "./hooks";
import { ViewportStage } from "./viewport-stage";
import { Viewport } from "./viewport";
import { render } from "react-dom";

const color = 0x0000ff;

const brush = new PIXI.Graphics()
  .beginFill(color)
  .drawCircle(0, 0, 50)
  .endFill();

// Create a line that will interpolate the drawn points
const line = new PIXI.Graphics();

interface PaintingLayerProps {
  mask: PIXI.RenderTexture;
}

function PaintingLayer({ mask }: PaintingLayerProps) {
  const app = useApp();

  const mouseMove = useCallback(
    (point: PIXI.Point, last: PIXI.Point | null) => {
      brush.position.set(point.x, point.y);

      app.renderer.render(brush, {
        renderTexture: mask,
        clear: false,
        skipUpdateTransform: false,
      });

      // Smooth out the drawing a little bit to make it look nicer
      // this connects the previous drawn point to the current one
      // using a line
      if (last) {
        line
          .clear()
          .lineStyle({ width: 100, color: color })
          .moveTo(last.x, last.y)
          .lineTo(point.x, point.y);

        app.renderer.render(line, {
          renderTexture: mask,
          clear: false,
          skipUpdateTransform: false,
        });
      }
    },
    [app, mask]
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

  const thingRef = useRef<Stage>(null);

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

    if (!thingRef.current) {
      console.log("No thingRef");
      return;
    }

    console.log("Save");

    // Create a renderer
    const renderer = PIXI.autoDetectRenderer({
      width: texture.width,
      height: texture.height,
      backgroundColor: 0x000000,
      backgroundAlpha: 1,
    });

    console.log("renderer", { renderer, renderTexture });

    const bg = new PIXI.Graphics()
      .beginFill(0xde3249)
      .drawRect(0, 0, texture.width, texture.height)
      .endFill();
    // const background = new PIXI.Sprite(texture);
    // background.x = 100;
    const container = new PIXI.Container();
    container.addChild(bg);
    const sprite = new PIXI.Sprite(renderTexture);
    container.addChild(sprite);

    const rt = renderer.generateTexture(container, {
      width: texture.width,
      height: texture.height,
    });

    rt.on("update", (a) => {
      console.log("update", a);
    });

    const d = await renderer.extract.base64(rt);
    window.open(d, "_blank");
    console.log("data", d);
  }, [texture, renderTexture]);

  return (
    <div className="flex flex-row">
      <div className="w-full h-full overflow-hidden" ref={containerRef}>
        {ready && (
          <Stage
            ref={thingRef}
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
                  <PaintingLayer mask={renderTexture} />
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
