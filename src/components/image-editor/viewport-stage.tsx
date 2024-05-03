import { Stage } from "@pixi/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Viewport } from "./viewport";

type ViewportSize = {
  width: number;
  height: number;
};

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export function ViewportStage({ children }: Props) {
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

  return (
    <div className="w-full h-full overflow-hidden" ref={containerRef}>
      {ready && (
        <Stage
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
            {children}
          </Viewport>
        </Stage>
      )}
    </div>
  );
}
