import { Grid, List, LinearProgress, Container } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Stage, Layer } from "react-konva";
import Robot from "../../components/Game/Robot";
import Misile from "../../components/Game/Misile";

export default function Board() {
  const [position, setPosition] = useState(0);
  const stageParentRef = useRef();
  const intervalRef = useRef();
  const stageRef = useRef();
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

  const colors = ["red", "black", "green", "blue", "cyan"];

  useEffect(() => {
    intervalRef.current = getInterval();
    window.addEventListener("resize", fitStageIntoParentContainer);
    fitStageIntoParentContainer();
    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("resize", fitStageIntoParentContainer);
    };
  }, []);

  function getInterval() {
    const progressInterval = setInterval(() => {
      setPosition((position) => position + 1);
    }, 100);
    return progressInterval;
  }

  useLayoutEffect(() => {
    fitStageIntoParentContainer();
  }, [stageParentRef]);

  const frames = [
    {
      robots: [
        {
          id: 1,
          robotName: "Pinaculo",
          robotPosition: { x: 100, y: 200 },
          health: 100,
        },
        {
          id: 2,
          robotName: "Jorge",
          robotPosition: { x: 200, y: 200 },
          health: 100,
        },
        {
          id: 3,
          robotName: "Aurelio",
          robotPosition: { x: 700, y: 200 },
          health: 100,
        },
        {
          id: 4,
          robotName: "Bonifacio",
          robotPosition: { x: 100, y: 200 },
          health: 100,
        },
      ],
      misiles: [
        {
          sender: 1,
          misilePosition: { x: 100, y: 200 },
          end: { x: 200, y: 500 },
        },
      ],
    },
    {
      robots: [
        {
          id: 1,
          robotName: "Pinaculo",
          robotPosition: { x: 500, y: 200 },
          health: 60,
        },
        {
          id: 2,
          robotName: "Jorge",
          robotPosition: { x: 200, y: 200 },
          health: 40,
        },
        {
          id: 3,
          robotName: "Aurelio",
          robotPosition: { x: 700, y: 200 },
          health: 40,
        },
        {
          id: 4,
          robotName: "Bonifacio",
          robotPosition: { x: 100, y: 200 },
          health: 20,
        },
      ],
      misiles: [
        {
          sender: 1,
          misilePosition: { x: 500, y: 200 },
          end: { x: 200, y: 500 },
        },
      ],
    },
  ];

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
            {frames[position]
              ? frames[position].robots.map((robot) => {
                  // console.log(robot);
                  return (
                    <Robot
                      key={robot.id}
                      name={robot.name}
                      x={robot.robotPosition ? robot.robotPosition.x : 100}
                      y={robot.robotPosition ? robot.robotPosition.y : 200}
                      fill={colors[robot.id - 1]}
                    />
                  );
                })
              : // frames[position].misiles.map((misile) =>)
                frames[frames.length - 1].robots.map((robot) => {
                  // console.log(robot);
                  return (
                    <Robot
                      key={robot.id}
                      name={robot.name}
                      x={robot.robotPosition ? robot.robotPosition.x : 100}
                      y={robot.robotPosition ? robot.robotPosition.y : 200}
                      fill={colors[robot.id - 1]}
                    />
                  );
                })}
            {/* {misiles.map((misile) => {
              return (
                <Misile
                  key={misile.misileId}
                  position={misile.misilePosition[position]}
                  fill={colors[0]}
                  scale={
                    misile.misilePosition.length >= position
                      ? { x: 0.3, y: 0.3 }
                      : position === misile.misilePosition.length + 1
                      ? { x: 20, y: 20 }
                      : { x: 0, y: 0 }
                  }
                />
              );
            })} */}
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
          {frames[position]
            ? frames[position].robots.map((robot) => {
                return (
                  <Grid
                    key={robot.id}
                    style={{
                      marginBottom: "1rem",
                      border: ".1rem solid black",
                      padding: "1rem",
                      width: "10rem",
                    }}
                  >
                    {robot.robotName}
                    <LinearProgress
                      value={robot.health}
                      variant="determinate"
                    />
                  </Grid>
                );
              })
            : frames[frames.length - 1].robots.map((robot) => {
                return (
                  <Grid
                    key={robot.id}
                    style={{
                      marginBottom: "1rem",
                      border: ".1rem solid black",
                      padding: "1rem",
                      width: "10rem",
                    }}
                  >
                    {robot.robotName}
                    <LinearProgress
                      value={robot.health}
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
