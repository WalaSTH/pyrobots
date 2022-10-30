import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Routes from "./routes";
import NavigationLayout from "./layouts/Main";

export default function App() {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user_id, setUserID] = useState(localStorage.getItem("userID"));
  const [username, setUsername] = useState(localStorage.getItem("username"));

  function handleLogin(t) {
    localStorage.setItem("token", t.access_token);
    localStorage.setItem("userID", t.userid);
    localStorage.setItem("username", t.username);
    setToken(t.access_token);
    setUserID(t.id);
    setUsername(t.username);
    navigate("/");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    localStorage.removeItem("username");
    setToken(null);
    setUserID(null);
    setUsername(null);
    navigate("/");
  }

  return (
    <Box>
      <NavigationLayout
        navigate={navigate}
        handleLogout={handleLogout}
        token={token}
      />
      <Routes navigate={navigate} handleLogin={handleLogin} userID={user_id} />
    </Box>
  );
}
