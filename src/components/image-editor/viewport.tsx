import React from "react";
import * as PIXI from "pixi.js";
import { PixiComponent, useApp } from "@pixi/react";
import { Viewport as PixiViewport } from "pixi-viewport";

export interface ViewportProps {
  width: number;
  height: number;
  children?: React.ReactNode;
}

export interface PixiComponentViewportProps extends ViewportProps {
  app: PIXI.Application;
  viewport: PixiViewport;
}

const PixiComponentViewport = PixiComponent("Viewport", {
  create: (props: PixiComponentViewportProps) => {
    const { viewport } = props;
    return viewport;
  },
});

const ViewportContext = React.createContext<PixiViewport | null>(null);

export const Viewport = (props: ViewportProps) => {
  const app = useApp();
  const { width, height } = props;
  const { ticker } = app;
  const { events } = app.renderer;

  const viewport = React.useMemo(() => {
    const v = new PixiViewport({
      screenWidth: width,
      screenHeight: height,
      worldWidth: width,
      worldHeight: height,
      ticker: ticker,
      events: events,
    });

    v.drag({
      keyToPress: ["ControlLeft", "ControlRight"],
    })
      .pinch()
      .wheel()
      //.clamp({ direction: "all" })
      .clampZoom({ minScale: 0.1, maxScale: 4 });
    //.decelerate();

    return v;
  }, [width, height, ticker, events]);

  return (
    <ViewportContext.Provider value={viewport}>
      <PixiComponentViewport app={app} viewport={viewport} {...props} />
    </ViewportContext.Provider>
  );
};

export const useViewport = () => {
  const viewport = React.useContext(ViewportContext);

  if (!viewport) {
    throw new Error("useViewport must be used within a ViewportProvider");
  }
  return viewport;
};
