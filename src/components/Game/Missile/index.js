import { useEffect, useRef } from "react";
import { Circle } from "react-konva";

export default function Missile({ position, ...props }) {
  const missileRef = useRef(null);
  var mIdCount = 0;
  useEffect(() => {
    const mis = missileRef.current;
    mis.to({ ...position, duration: 0.5 });
    // mis.rotate()
  });

  return (
    <Circle
      key={props.id ? props.id : mIdCount++}
      ref={missileRef}
      x={props.x ? props.x : 100}
      y={props.y ? props.y : 100}
      radius={props.radius ? props.radius : 30}
      {...props}
    />
  );
}
