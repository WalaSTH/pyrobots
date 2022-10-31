// Select robot --> Component
import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import jwt_decode from "jwt-decode";
import { useEffect } from "react";
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

  const { data } = await axios.get("http://localhost:8000/robot/list", {
    params: { user_name: username, detailed: true },
  });

  console.log("API RETURNS", data);

  if (data.detail === "No Robots available") {
    return [];
  }

  return data.Robots;
};

export default function SelectRobot() {
  const [age, setAge] = React.useState("");
  const [robotData, setRobotData] = React.useState([]);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  useEffect(() => {
    console.log("Fetching data");
    fetchData().then((response) => setRobotData(response));
  }, []);

  const [id, name, other] = robotData;
  console.log("NAME", name && name[1]);

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          {robotData.map(() => (
            <MenuItem value={id}>{name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
