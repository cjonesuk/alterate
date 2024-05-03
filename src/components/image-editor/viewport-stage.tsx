import { Stage } from "@pixi/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Viewport } from "./viewport";

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export function ViewportStage({ children }: Props) {
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
