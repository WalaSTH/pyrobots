// List robot --> Screen
import React from "react";
import Grid from "@mui/material/Grid";
import CardList from "../../components/CardRobot/CardRobot";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import axios from "axios";

const fetchData = async () => {
  let token, decoded, username;

  try {
    token = localStorage.getItem("token");
    decoded = jwt_decode(token);
    username = decoded.sub;
  } catch (err) {
    console.log("Error while decodign the token", err);
  }

  if (!username) {
    console.log("Username does not exist");
    return [];
  }

  const { data, status, statusText } = await axios.get(
    "http://localhost:8000/robot/list",
    {
      params: { user_name: username, detailed: true },
    }
  );

  if (status !== 200) {
    console.log(statusText);
    return [];
  }

  return data.Robots;
};

export default function Elevation() {
  const [dataRobot, setdataRobot] = useState([]);

  useEffect(() => {
    console.log("Fetching data");
    fetchData().then((response) => setdataRobot(response));
  }, []);

  return (
    <Grid container spacing={2} sx={{ padding: "7%" }}>
      {dataRobot.map((robot) => (
        <Grid key={robot[0]} item xs={3}>
          <CardList robot={robot} />
        </Grid>
      ))}
    </Grid>
  );
}
