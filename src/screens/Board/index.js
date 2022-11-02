import { Grid, List, LinearProgress, Container } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Stage, Layer } from "react-konva";
import Robot from "../../components/Game/Robot";
import Missile from "../../components/Game/Missile";
import frames from "./prueba.json";

export default function Board() {
  var robotColor = 0;
  const [position, setPosition] = useState(0);
  const stageParentRef = useRef();
  const intervalRef = useRef();
  const stageRef = useRef();
  const lifeRef = useRef();
  const sceneWidth = 1000;
  const sceneHeight = 1000;

  function fitStageIntoParentContainer() {
    var container = stageParentRef.current;

    var containerWidth = container.offsetWidth;
    var scale = containerWidth / sceneWidth;

    stageRef.current.width(sceneWidth * scale - 2);
    stageRef.current.height(sceneHeight * scale);
    stageRef.current.scale({ x: scale, y: scale });
  }

  const colors = ["red", "green", "black", "blue"];

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
                  return (
                    <Robot
                      key={robotColor++}
                      name={robot.name}
                      x={robot.robotPosition ? robot.robotPosition.x : 100}
                      y={robot.robotPosition ? robot.robotPosition.y : 200}
                      fill={colors[robotColor % colors.length]}
                    />
                  );
                }) // ? frames[position].missiles.map((missile) => {
              : //     return (
                //       <Missile
                //         key={missile.missileId}
                //         position={missile.missilePosition[position]}
                //         fill={colors[0]}
                //         scale={
                //           missile.missilePosition.length >= position
                //             ? { x: 0.3, y: 0.3 }
                //             : position === missile.missilePosition.length + 1
                //             ? { x: 20, y: 20 }
                //             : { x: 0, y: 0 }
                //         }
                //       />
                //     );
                //   })
                // : null
                setPosition(frames.length - 1) &&
                window.removeEventListener(
                  "resize",
                  fitStageIntoParentContainer
                )}
            {/* {missiles.map((missile) => {
              return (
                <Missile
                  key={missile.missileId}
                  position={missile.missilePosition[position]}
                  fill={colors[0]}
                  scale={
                    missile.missilePosition.length >= position
                      ? { x: 0.3, y: 0.3 }
                      : position === missile.missilePosition.length + 1
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
          ref={lifeRef}
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {frames[position]
            ? frames[position].robots.map((robot) => {
                return (
                  <Grid
                    key={robot.robotName}
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
            : setPosition(frames.length - 1) &&
              window.removeEventListener("resize", fitStageIntoParentContainer)}
        </List>
      </Box>
    </Container>
  );
}
