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
}

const PixiComponentViewport = PixiComponent("Viewport", {
  create: (props: PixiComponentViewportProps) => {
    // Install EventSystem, if not already
    // (PixiJS 6 doesn't add it by default)
    if (!("events" in props.app.renderer))
      props.app.renderer.addSystem(PIXI.EventSystem, "events");

    const { width, height } = props;
    const { ticker } = props.app;
    const { events } = props.app.renderer;

    const viewport = new PixiViewport({
      screenWidth: width,
      screenHeight: height,
      worldWidth: width,
      worldHeight: height,
      ticker: ticker,
      events: events,
    });

    viewport
      .drag()
      .pinch()
      .wheel()
      //.clamp({ direction: "all" })
      .clampZoom({ minScale: 0.1, maxScale: 4 });
    //.decelerate();

    return viewport;
  },
});

const Viewport = (props: ViewportProps) => {
  const app = useApp();
  return <PixiComponentViewport app={app} {...props} />;
};

export { Viewport };
