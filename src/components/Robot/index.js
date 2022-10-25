import { useEffect, useRef } from "react";
import { Circle } from "react-konva";

const Robot = ({ position, ...props }) => {
  const rectRef = useRef(null);
  useEffect(() => {
    const rect = rectRef.current;
    rect.to({ ...position, duration: 0.5 });
  });

  return <Circle ref={rectRef} {...props} />;
};

export default Robot;
