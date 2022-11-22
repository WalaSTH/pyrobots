import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Routes from "./routes";
import NavigationLayout from "./layouts/Main";
import { useState } from "react";

export default function App() {
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar"));

  const navigate = useNavigate();
  return (
    <Box display="flex" height="100vh">
      <NavigationLayout navigate={navigate} avatar={avatar} />
      <Routes navigate={navigate} avatar={avatar} setAvatar={setAvatar} />
    </Box>
  );
}
