import React from "react";
import { Stage, Layer, Circle, Text } from "react-konva";

export default function Board() {
  const robotMovement = [
    { x: 100, y: 100 },
    { x: 115, y: 115 },
    { x: 120, y: 120 },
    { x: 110, y: 110 },
    { x: 100, y: 100 },
    { x: 140, y: 140 },
    { x: 140, y: 160 },
  ];

  return (
    <div id="konvaBoard" style={{ backgroundColor: "red" }}>
      <Stage height={400} width={600} x={100} y={100} container="konvaBoard">
        <Layer>
          <Text text="Tu nariz contra mis bolas" x={100} y={200} />
          {robotMovement.map((element) => (
            <Circle
              x={element.x}
              y={element.y}
              radius={5}
              fill="#89b71"
              opacity={0.8}
              shadowColor="black"
              shadowBlur={10}
              shadowOpacity={0.6}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
