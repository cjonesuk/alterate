import { Stage } from "@pixi/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Viewport } from "./viewport";
import { Button } from "../ui/button";

type ViewportSize = {
  width: number;
  height: number;
};

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

// todo: remove or refactor?
export function ViewportStage({ children }: Props) {
  const [viewportSize, setViewportSize] = useState<ViewportSize | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const ready = viewportSize !== null && canvasRef.current !== null;

  const handleSave = useCallback(() => {
    console.log("Save");
  }, []);

  return (
    <div className="flex flex-row">
      <div className="w-full h-full overflow-hidden" ref={containerRef}>
        <canvas id="something" ref={canvasRef}></canvas>
        {ready && (
          <Stage
            width={viewportSize.width}
            height={viewportSize.height}
            options={{
              backgroundColor: 0x202020,
              width: viewportSize.width,
              height: viewportSize.height,
              hello: true,
              view: canvasRef.current,
            }}
          >
            <Viewport width={viewportSize.width} height={viewportSize.height}>
              {children}
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
