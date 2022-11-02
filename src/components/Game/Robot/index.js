import { useEffect, useRef } from "react";
import { Circle } from "react-konva";

export default function Robot({ position, ...props }) {
  const roboRef = useRef(null);
  var rIdCount = 0;

  return (
    <Circle
      key={props.id ? props.id : rIdCount++}
      ref={roboRef}
      x={props.x ? props.x : 100}
      y={props.y ? props.y : 100}
      radius={props.radius ? props.radius : 10}
      {...props}
    />
  );
}
