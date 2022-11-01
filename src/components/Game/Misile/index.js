import { useEffect, useRef } from "react";
import { Circle } from "react-konva";

export default function Misile({ position, ...props }) {
  const misileRef = useRef(null);
  var mIdCount = 0;
  useEffect(() => {
    const mis = misileRef.current;
    mis.to({ ...position, duration: 0.5 });
    // mis.rotate()
  });

  return (
    <Circle
      key={props.id ? props.id : mIdCount++}
      ref={misileRef}
      x={props.x ? props.x : 100}
      y={props.y ? props.y : 100}
      radius={props.radius ? props.radius : 30}
      {...props}
    />
  );
}
