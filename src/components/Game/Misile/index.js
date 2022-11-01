import { useEffect, useRef } from "react";
import { Arrow } from "react-konva";

export default function Misile({ position, ...props }) {
  const misileRef = useRef(null);
  useEffect(() => {
    const rect = misileRef.current;
    rect.to({ ...position, duration: 0.5 });
  });

  return (
    <Arrow
      x={props.x ? props.x : 100}
      y={props.y ? props.y : 100}
      ref={misileRef}
      innerRadius={props.radius ? props.radius : 30}
      outerRadius={props.radius ? props.radius : 30}
      {...props}
    />
  );
}
