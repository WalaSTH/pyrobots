import { Grid, List, LinearProgress, Container, Box } from "@mui/material";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Stage, Layer } from "react-konva";
import Robot from "../../components/Game/Robot";
import { useParams, useNavigate } from "react-router-dom";
// import Missile from "../../components/Game/Missile";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function cleanAll(localID) {
  await delay(5000);
  localStorage.removeItem(localID);
}

export default function Board() {
  var [finished, setFinished] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const data = localStorage.getItem(params.simID);
  const frames = JSON.parse(data).data;
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

  const colors = ["red", "green", "black", "purple"];

  useEffect(() => {
    intervalRef.current = getInterval();
    window.addEventListener("resize", fitStageIntoParentContainer);
    fitStageIntoParentContainer();
    if (finished) {
      clearInterval(intervalRef.current);
      setPosition(frames.length - 1);
      cleanAll(params.simID);
      navigate("/");

      // alert(
      //   "Termino la simulacion. El ganador es: " +
      //     frames[frames.length - 1].robots[0].robotName
      // );
    }
    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("resize", fitStageIntoParentContainer);
    };
  }, [finished]);

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
                      key={robot.id}
                      name={robot.name}
                      x={robot.robotPosition ? robot.robotPosition.x : 100}
                      y={robot.robotPosition ? robot.robotPosition.y : 200}
                      fill={colors[robot.id % colors.length]}
                    />
                  );
                })
              : setFinished(true)}
            {/* {missiles.map((missile) => {
              return (
                <Missile
                  key={missile.id}
                  position={missile.missilePosition[position]}
                  fill={colors[missile.sender]}
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
                    key={robot.id}
                    style={{
                      marginBottom: "1rem",
                      border: ".1rem solid black",
                      padding: "1rem",
                      width: "10rem",
                      backgroundColor: colors[robot.id % colors.length],
                    }}
                  >
                    <div
                      style={{
                        color: "white",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      {robot.robotName}
                    </div>
                    <LinearProgress
                      value={robot.health}
                      variant="determinate"
                      color="primary"
                    />
                    <div
                      style={{
                        color: "white",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: "5px",
                      }}
                    >
                      {robot.health + "%"}
                    </div>
                  </Grid>
                );
              })
            : setPosition(frames.length - 1)}
        </List>
      </Box>
    </Container>
  );
}
