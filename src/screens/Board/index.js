import {
  Grid,
  List,
  LinearProgress,
  Container,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slider,
} from "@mui/material";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Stage, Layer } from "react-konva";
import Robot from "../../components/Game/Robot";
import { useParams, useNavigate } from "react-router-dom";
import Missile from "../../components/Game/Missile";

export default function Board() {
  var [finished, setFinished] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  localStorage.setItem("simID", params.simID);
  const data = localStorage.getItem(params.simID);
  const frames = JSON.parse(data).data;
  const winner = frames.winner;
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
      setDialogOpen(true);
    }
    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("resize", fitStageIntoParentContainer);
    };
    //eslint-disable-next-line
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
      {dialogOpen && (
        <Dialog open={dialogOpen}>
          <DialogTitle>Simulation results</DialogTitle>
          <DialogContent>
            <Box display="flex">
              <DialogContentText sx={{ marginLeft: "10px" }}>
                {winner ? "The winner is " + winner : "Nobody won!"}
              </DialogContentText>
            </Box>
          </DialogContent>
          <DialogActions>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Button
                variant="filled"
                sx={{ color: "primary.main" }}
                onClick={() => {
                  setDialogOpen(false);
                  navigate("/");
                }}
              >
                Back to home
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      )}
      <Grid
        style={{
          border: ".1rem solid black",
          width: "80%",
        }}
        ref={stageParentRef}
      >
        <Slider
          aria-label="Frame"
          max={frames.frames.length}
          value={position}
          onChange={(e, v) => {
            setPosition(v);
          }}
        />
        <Stage ref={stageRef} data-testid="board">
          <Layer>
            {frames.frames[position]
              ? frames.frames[position].robots.map((robot) => {
                  return (
                    <Robot
                      key={robot.id}
                      radius={12}
                      name={robot.name}
                      x={robot.robotPosition ? robot.robotPosition.x : 100}
                      y={robot.robotPosition ? robot.robotPosition.y : 200}
                      fill={colors[robot.id % colors.length]}
                    />
                  );
                })
              : setFinished(true)}
            {frames.frames[position]
              ? frames.frames[position].missiles.map((missile) => {
                  return (
                    <Missile
                      key={missile.id}
                      radius={7}
                      x={
                        missile.missilePosition.x
                          ? missile.missilePosition.x
                          : 100
                      }
                      y={
                        missile.missilePosition.y
                          ? missile.missilePosition.y
                          : 100
                      }
                      fill={colors[missile.id]}
                    />
                  );
                })
              : setFinished(true)}
            {frames.frames[position]
              ? frames.frames[position].explotions.map((explotion) => {
                  return (
                    <Missile
                      key={explotion.id}
                      radius={40}
                      x={
                        explotion.explotionPosition.x
                          ? explotion.explotionPosition.x
                          : 100
                      }
                      y={
                        explotion.explotionPosition.y
                          ? explotion.explotionPosition.y
                          : 100
                      }
                      fill={colors[explotion.id]}
                    />
                  );
                })
              : setFinished(true)}
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
          {frames.frames[position]
            ? frames.frames[position].robots.map((robot) => {
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
            : setPosition(frames.frames.length - 1)}
        </List>
      </Box>
    </Container>
  );
}
