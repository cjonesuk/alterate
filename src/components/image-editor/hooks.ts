import * as PIXI from "pixi.js";
import { useCallback, useRef } from "react";
import { useViewport } from "./viewport";

interface Input {
  onMove: (point: PIXI.Point, last: PIXI.Point | null) => void;
}

export function useMouseFlow({ onMove }: Input) {
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
