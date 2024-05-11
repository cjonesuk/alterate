import { ImageReference } from "@/lib/comfyui/images";
import { Container, Graphics, Sprite, Stage, useApp } from "@pixi/react";
import * as PIXI from "pixi.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useImageAndMaskUrls } from "@/lib/image-query";
import { useMouseFlow } from "./hooks";
import { Viewport } from "./viewport";
import { useAlterateStore } from "@/lib/store";

import P5 from "p5";

// Create a line that will interpolate the drawn points
const line = new PIXI.Graphics();

// Helper function to convert a data URL to a Blob object
function dataURLToBlob(dataURL: string) {
  const parts = dataURL.split(";base64,");
  const contentType = parts[0].split(":")[1];
  const byteString = atob(parts[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: contentType });
}

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

type MaskStyle = "white" | "black" | "negative";

type DrawMode = "draw" | "erase";

interface MaskingLayerProps {
  image: PIXI.Texture;
  mask: PIXI.RenderTexture;
  brushSize: number;
  maskStyle: MaskStyle;
  drawMode: DrawMode;
}

function MaskingLayer({
  image,
  mask,
  brushSize,
  maskStyle,
  drawMode,
}: MaskingLayerProps) {
  const app = useApp();

  const { width, height } = mask;

  const { brush, lineStyle } = useMemo(() => {
    const brushColor = drawMode === "draw" ? 0xffffff : 0x000000;
    const brush = new PIXI.Graphics()
      .beginFill(brushColor)
      .drawCircle(0, 0, brushSize)
      .endFill();

    const lineStyle = { width: brushSize * 2, color: brushColor };

    return { brush, lineStyle };
  }, [brushSize, drawMode]);

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
    if (maskStyle === "negative") {
      const negativeFilter = new PIXI.ColorMatrixFilter();
      negativeFilter.negative(false);

      return { filters: [negativeFilter] };
    }
    return { filters: [] };
  }, [maskStyle]);

  const maskRef = useRef<PIXI.Sprite>(null);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.alpha = 0.4;
      g.beginFill(maskStyle === "white" ? 0xffffff : 0x000000);
      g.drawRect(0, 0, width, height);
      g.endFill();
    },
    [width, height, maskStyle]
  );

  return (
    <Container
      interactive={true}
      onpointerdown={pointerDown}
      onpointerup={pointerUp}
      pointerupoutside={pointerUp}
      pointermove={pointerMove}
    >
      <Sprite texture={mask} renderable={false} ref={maskRef} />

      {ready && (maskStyle === "white" || maskStyle === "black") && (
        <Graphics mask={maskRef.current} draw={draw} />
      )}

      {ready && maskStyle === "negative" && (
        <Sprite
          interactive={true}
          mask={maskRef.current}
          texture={image}
          filters={filters}
          onpointerdown={pointerDown}
          onpointerup={pointerUp}
          pointerupoutside={pointerUp}
          pointermove={pointerMove}
        />
      )}
    </Container>
  );
}

export interface ImageEditorProps {
  onSave: (maskReference: ImageReference) => void;
  imageReference: ImageReference;
}

type ViewportSize = {
  width: number;
  height: number;
};

export function ImageEditor({ onSave, imageReference }: ImageEditorProps) {
  const urls = useImageAndMaskUrls(imageReference);

  const uploadMask = useAlterateStore((state) => state.uploadMask);

  const [imageTexture, setImageTexture] = useState<PIXI.Texture | null>(null);
  const [maskTexture, setMaskTexture] = useState<PIXI.RenderTexture | null>(
    null
  );

  const [app, setApp] = useState<PIXI.Application | null>(null);

  useEffect(() => {
    if (!urls) {
      return;
    }

    const sourceRgb = PIXI.Texture.from(urls.rgb);
    sourceRgb
      .on("update", () => {
        if (sourceRgb.valid) {
          setImageTexture(sourceRgb);

          sourceRgb.removeListener("update");
        }
      })
      .on("error", (e) => console.error("error loading texture", e));
  }, [urls]);

  useEffect(() => {
    if (!urls || !imageTexture) {
      return;
    }

    new P5((p5: P5) => {
      let alphaImage: P5.Image;
      p5.preload = () => {
        alphaImage = p5.loadImage(urls.alpha);
      };
      p5.setup = () => {
        p5.noLoop();

        if (!app) {
          throw new Error("No app");
        }

        if (!app.renderer) {
          throw new Error("No renderer");
        }

        alphaImage.loadPixels();
        const firstPixels = alphaImage.pixels;

        // invert mask
        for (let i = 0; i < firstPixels.length; i += 4) {
          firstPixels[i + 3] = 255 - firstPixels[i + 3];
          firstPixels[i] = 255;
          firstPixels[i + 1] = 255;
          firstPixels[i + 2] = 255;
        }

        // Save changes and calculate premultiplied alpha
        alphaImage.updatePixels();

        // Reload the updated pixel data
        alphaImage.loadPixels();

        // Convert to 8 bit per pixel RGBA
        const uint8Array: Uint8Array = Uint8Array.from(alphaImage.pixels);

        // Create the mask texture
        const preparedMask = PIXI.Texture.fromBuffer(
          uint8Array,
          alphaImage.width,
          alphaImage.height,
          {
            format: PIXI.FORMATS.RGBA,
          }
        );

        // Create the mask render texture
        const renderTexture = PIXI.RenderTexture.create({
          width: alphaImage.width,
          height: alphaImage.height,
          format: PIXI.FORMATS.RGBA,
        });

        // Render the mask texture to the render texture
        const preparedMaskSprite = new PIXI.Sprite(preparedMask);

        app.renderer.render(preparedMaskSprite, {
          renderTexture,
          clear: true,
        });

        setMaskTexture(renderTexture);
      };
      p5.draw = () => {};
    });
  }, [urls, imageTexture, app]);

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
    if (!imageTexture) {
      console.log("No texture");
      return;
    }

    if (!maskTexture) {
      console.log("No render texture");
      return;
    }

    if (!app) {
      console.log("No app");
      return;
    }

    const maskSprite = new PIXI.Sprite(maskTexture);

    const alphaImageDataElement = await app.renderer.extract.image(
      maskSprite,
      "image/png",
      0.92,
      new PIXI.Rectangle(0, 0, imageTexture.width, imageTexture.height)
    );

    alphaImageDataElement.onload = () => {
      const backupCanvas = document.createElement("canvas");
      const backupCtx = backupCanvas.getContext("2d", {
        willReadFrequently: true,
        alpha: true,
      });

      if (!backupCtx) {
        throw new Error("No context");
      }

      backupCanvas.width = imageTexture.width;
      backupCanvas.height = imageTexture.height;

      backupCtx.clearRect(0, 0, backupCanvas.width, backupCanvas.height);

      backupCtx.drawImage(
        alphaImageDataElement,
        0,
        0,
        backupCanvas.width,
        backupCanvas.height
      );

      // paste mask data into alpha channel
      const backupData = backupCtx.getImageData(
        0,
        0,
        backupCanvas.width,
        backupCanvas.height
      );

      for (let i = 0; i < backupData.data.length; i += 4) {
        // The alpha channel is the red channel inverted
        // set the RGB values to 0

        backupData.data[i + 3] = 255 - backupData.data[i];
        backupData.data[i] = 0;
        backupData.data[i + 1] = 0;
        backupData.data[i + 2] = 0;
      }

      backupCtx.globalCompositeOperation = "source-over";
      backupCtx.putImageData(backupData, 0, 0);

      const dataURL = backupCanvas.toDataURL();

      const blob = dataURLToBlob(dataURL);

      uploadMask(blob, imageReference).then((result) => {
        console.log("mask uploaded", result);
        onSave(result);
      });
    };
  }, [imageTexture, maskTexture, app, uploadMask, imageReference, onSave]);

  const [maskStyle, setMaskStyle] = useState<MaskStyle>("white");
  const [drawMode, setDrawMode] = useState<DrawMode>("draw");

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
              backgroundAlpha: 0,
            }}
          >
            <Viewport width={viewportSize.width} height={viewportSize.height}>
              <Container x={0} y={0}>
                {imageTexture && <Sprite texture={imageTexture} />}

                {imageTexture && maskTexture && (
                  <MaskingLayer
                    image={imageTexture}
                    mask={maskTexture}
                    brushSize={50}
                    maskStyle={maskStyle}
                    drawMode={drawMode}
                  />
                )}
              </Container>
            </Viewport>
          </Stage>
        )}
      </div>
      <div className="flex flex-col gap-4 p-4">
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={() => setMaskStyle("white")}>White</Button>
        <Button onClick={() => setMaskStyle("black")}>Black</Button>
        <Button onClick={() => setMaskStyle("negative")}>Negative</Button>
        <Button
          onClick={() =>
            setDrawMode((prev) => (prev === "draw" ? "erase" : "draw"))
          }
        >
          {drawMode === "draw" ? "Draw" : "Erase"}
        </Button>
      </div>
    </div>
  );
}
