import React from "react";
import Grid from "@mui/material/Grid";
import CardList from "../../components/CardRobot/CardRobot";
import { useEffect, useState } from "react";
import getRobots from "../../api/getRobots";
import { Alert, Container } from "@mui/material";

export default function Elevation() {
  const [dataRobot, setDataRobot] = useState([]);

  useEffect(() => {
    getRobots(true).then((e) => {
      setDataRobot(e);
    });
  }, []);

  if (dataRobot.length === 0) {
    return (
      <Grid
        item
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
        }}
      >
        <Alert severity="warning">You dont have any robots!</Alert>
      </Grid>
    );
  }

  return (
    <Container>
      <Grid container spacing={2} padding="5%" mt={{ xs: 8, md: 0 }}>
        {dataRobot.map((robot) => (
          <Grid key={robot[0]} item xs={12} sm={6} md={4}>
            <CardList robot={robot} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
