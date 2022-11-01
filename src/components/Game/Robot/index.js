import { useEffect, useRef } from "react";
import { Circle } from "react-konva";

export default function Robot({ position, ...props }) {
  const roboRef = useRef(null);
  useEffect(() => {
    const rect = roboRef.current;
    rect.to({ ...position, duration: 0.5 });
  });

  return (
    <Circle
      x={props.x ? props.x : 100}
      y={props.y ? props.y : 100}
      ref={roboRef}
      radius={props.radius ? props.radius : 30}
      {...props}
    />
  );
}
