import { Container } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import Robot from "../../components/Robot";

export default function Board() {
  const intervalRef = useRef();
  const [position, setPosition] = useState(0);

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

  return (
    <Container style={{ marginTop: "7rem" }}>
      <Stage
        width={1000}
        height={800}
        style={{
          backgroundColor: "white",
          border: ".1rem solid black",
          borderRadius: 8,
          display: "grid",
          gridTemplateRows: "repeat(#,1fr)",
        }}
      >
        <Layer x={40} y={100}>
          <Robot
            position={robotPositions[position]}
            fill="#F5447F"
            radius={10}
          />
        </Layer>
      </Stage>
    </Container>
  );
}
