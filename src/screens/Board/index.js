import { Grid, List, LinearProgress, Container } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Stage, Layer } from "react-konva";
import Robot from "../../components/Game/Robot";
import Misile from "../../components/Game/Misile";

export default function Board() {
  var actualColor = 0;
  const intervalRef = useRef();
  const stageRef = useRef();
  const stageParentRef = useRef();
  const [position, setPosition] = useState(0);
  const sceneWidth = 1000;
  const sceneHeight = 1000;

  function fitStageIntoParentContainer() {
    var container = stageParentRef.current;

    var containerWidth = container.offsetWidth;
    var scale = containerWidth / sceneWidth;

    stageRef.current.width(sceneWidth * scale);
    stageRef.current.height(sceneHeight * scale);
    stageRef.current.scale({ x: scale, y: scale });
  }

  const robots = [
    {
      robotName: "Pepe",
      robotPosition: [
        { x: 200, y: 200 },
        { x: 100, y: 500 },
        { x: 300, y: 600 },
        { x: 200, y: 500 },
        { x: 700, y: 100 },
        { x: 200, y: 400 },
        { x: 100, y: 200 },
        { x: 100, y: 600 },
        { x: 50, y: 400 },
      ],
      healthProgress: [100, 90, 80, 70, 60, 50, 40, 30, 10],
    },
    {
      robotName: "Jorge",
      robotPosition: [
        { x: 300, y: 300 },
        { x: 100, y: 500 },
        { x: 300, y: 600 },
        { x: 300, y: 500 },
        { x: 700, y: 100 },
        { x: 300, y: 400 },
        { x: 100, y: 300 },
        { x: 100, y: 600 },
        { x: 50, y: 461 },
      ],
      healthProgress: [50, 60, 40, 70, 60, 50, 40, 30, 10],
    },
    {
      robotName: "Aurelio",
      robotPosition: [
        { x: 400, y: 400 },
        { x: 100, y: 500 },
        { x: 300, y: 600 },
        { x: 400, y: 500 },
        { x: 700, y: 100 },
        { x: 400, y: 400 },
        { x: 100, y: 400 },
        { x: 100, y: 600 },
        { x: 50, y: 522 },
      ],
      healthProgress: [100, 90, 80, 70, 60, 50, 40, 30, 10],
    },
    {
      robotName: "Pinaculo",
      robotPosition: [
        { x: 500, y: 500 },
        { x: 100, y: 500 },
        { x: 300, y: 600 },
        { x: 500, y: 500 },
        { x: 700, y: 100 },
        { x: 500, y: 400 },
        { x: 100, y: 500 },
        { x: 100, y: 600 },
        { x: 50, y: 583 },
      ],
      healthProgress: [30, 90, 80, 70, 60, 50, 40, 30, 10],
    },
  ];

  const colors = ["red", "black", "green", "blue"];

  const misiles = [
    {
      misilePosition: [
        { x: 100, y: 200 },
        { x: 500, y: 200 },
        { x: 400, y: 500 },
      ],
    },
  ];

  useEffect(() => {
    intervalRef.current = getInterval();
    return () => clearInterval(intervalRef.current);
  }, []);

  function getInterval() {
    const progressInterval = setInterval(() => {
      setPosition((position) => position + 1);
    }, 500);
    return progressInterval;
  }

  useLayoutEffect(() => {
    fitStageIntoParentContainer();
  }, [stageParentRef]);

  return (
    <Container
      maxwidth="xl"
      style={{ display: "flex", alignItems: "center" }}
      data-testid="boardContainer"
    >
      <Grid
        style={{
          border: ".1rem solid black",
          width: "80%",
        }}
        ref={stageParentRef}
      >
        <Stage ref={stageRef} data-testid="board">
          <Layer>
            {robots.map((robot) => {
              const colorIndex = actualColor++;
              return (
                <Robot
                  position={
                    robot.robotPosition[position]
                      ? robot.robotPosition[position]
                      : robot.robotPosition[robot.robotPosition.length - 1]
                  }
                  fill={colors[colorIndex]}
                />
              );
            })}
            {misiles.map((misile) => {
              return (
                <Misile
                  position={misile.misilePosition[position]}
                  fill={colors[0]}
                />
              );
            })}
          </Layer>
        </Stage>
      </Grid>
      <Box style={{ marginLeft: "3rem" }}>
        <List
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {robots.map((robot) => {
            return (
              <Grid
                style={{
                  marginBottom: "1rem",
                  border: ".1rem solid black",
                  padding: "1rem",
                  width: "10rem",
                }}
              >
                {robot.robotName}
                <LinearProgress
                  value={
                    robot.healthProgress[position]
                      ? robot.healthProgress[position]
                      : robot.healthProgress[robot.healthProgress.length - 1]
                  }
                  variant="determinate"
                />
              </Grid>
            );
          })}
        </List>
      </Box>
    </Container>
  );
}
