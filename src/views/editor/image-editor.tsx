import { Stage, Container, Sprite, Text, useApp } from "@pixi/react";
import * as PIXI from "pixi.js";
import { useCallback, useMemo, useRef } from "react";

const stageSize = { width: 800, height: 600 };

const brush = new PIXI.Graphics()
  .beginFill(0xffffff)
  .drawCircle(0, 0, 50)
  .endFill();

// Create a line that will interpolate the drawn points
const line = new PIXI.Graphics();

function Thing() {
  const app = useApp();

  const draggingRef = useRef(false);
  const lastDrawnPointRef = useRef<PIXI.Point | null>(null);

  const renderTexture = useMemo(() => {
    const rt = PIXI.RenderTexture.create(stageSize);

    brush.position.set(400, 300);
    app.renderer.render(brush, {
      renderTexture: rt,
      clear: false,
      skipUpdateTransform: false,
    });
    return rt;
  }, [app]);

  const pointerMove: PIXI.FederatedEventHandler = useCallback(
    ({ global: { x, y } }) => {
      if (draggingRef.current) {
        brush.position.set(x, y);
        app.renderer.render(brush, {
          renderTexture,
          clear: false,
          skipUpdateTransform: false,
        });
        // Smooth out the drawing a little bit to make it look nicer
        // this connects the previous drawn point to the current one
        // using a line
        if (lastDrawnPointRef.current) {
          line
            .clear()
            .lineStyle({ width: 100, color: 0xffffff })
            .moveTo(lastDrawnPointRef.current.x, lastDrawnPointRef.current.y)
            .lineTo(x, y);
          app.renderer.render(line, {
            renderTexture,
            clear: false,
            skipUpdateTransform: false,
          });
        }
        lastDrawnPointRef.current =
          lastDrawnPointRef.current || new PIXI.Point();
        lastDrawnPointRef.current.set(x, y);
      }
    },
    [app, renderTexture]
  );

  const pointerDown: PIXI.FederatedEventHandler = useCallback(
    (ev) => {
      draggingRef.current = true;
      pointerMove(ev);
    },
    [pointerMove]
  );

  const pointerUp: PIXI.FederatedEventHandler = useCallback(() => {
    draggingRef.current = false;
    lastDrawnPointRef.current = null;
  }, []);

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

export function ImageEditor() {
  return (
    <div>
      <Stage width={800} height={600} options={{ backgroundColor: "#FF0000" }}>
        <Sprite source="https://pixijs.com/assets/bg_grass.jpg" />
        <Thing />

        {/* <Sprite texture={renderTexture}></Sprite> */}
        <Container x={200} y={200}>
          <Text text="Hello World" anchor={0.5} x={220} y={150} />
        </Container>
      </Stage>
    </div>
  );
}
