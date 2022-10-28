import { Box } from "@mui/system";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Stage, Layer, Rect } from "react-konva";
import Robot from "../../components/Robot";

export default function Board() {
  const intervalRef = useRef();
  const stageRef = useRef();
  const [position, setPosition] = useState(0);
  const sceneWidth = 1000;
  const sceneHeight = 1000;

  function fitStageIntoParentContainer() {
    var container = document.querySelector("#stage-parent");

    // now we need to fit stage into parent container
    var containerWidth = container.offsetWidth;

    // but we also make the full scene visible
    // so we need to scale all objects on canvas
    var scale = containerWidth / sceneWidth;

    stageRef.current.width(sceneWidth * scale);
    stageRef.current.height(sceneHeight * scale);
    stageRef.current.scale({ x: scale, y: scale });
  }

  const robotPositions = [
    { x: 200, y: 200 },
    { x: 100, y: 500 },
    { x: 300, y: 600 },
    { x: 200, y: 500 },
    { x: 700, y: 100 },
    { x: 200, y: 400 },
    { x: 100, y: 200 },
    { x: 100, y: 600 },
    { x: 800, y: 400 },
  ];

  const scan = [10, 100, 200];

  useEffect(() => {
    intervalRef.current = getInterval();
    return () => clearInterval(intervalRef.current);
  }, []);

  const getInterval = () => {
    const progressInterval = setInterval(() => {
      setPosition((position) => position + 1);
    }, 500);
    return progressInterval;
  };

  useLayoutEffect(() => {
    fitStageIntoParentContainer();
  });

  return (
    <Box style={{ margin: "auto" }} id="stage-parent">
      <Stage ref={stageRef}>
        <Layer>
          <Robot
            position={robotPositions[position % robotPositions.length]}
            radius={scan[position % scan.length]}
            fill="#F5447F"
          />
        </Layer>
      </Stage>
    </Box>
  );
}
