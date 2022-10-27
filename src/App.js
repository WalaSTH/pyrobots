import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Routes from "./routes";
import Leftbar from "./components/Leftbar";

export default function App() {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user_id, setUserID] = useState(localStorage.getItem("userID"));
  const [username, setUsername] = useState(localStorage.getItem("username"));

  const handleLogin = (t) => {
    localStorage.setItem("token", t.access_token);
    localStorage.setItem("userID", t.userid);
    localStorage.setItem("username", t.username);
    setToken(t.access_token);
    setUserID(t.id);
    setUsername(t.username);
    navigate("/");
  };

  const handleLogout = (e) => {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    localStorage.removeItem("username");
    setToken(null);
    setUserID(null);
    setUsername(null);
    navigate("/");
  };

  return (
    <Box>
      <Leftbar navigate={navigate} handleLogout={handleLogout} token={token} />
      <Routes
        token={token}
        setToken={setToken}
        navigate={navigate}
        handleLogin={handleLogin}
        userID={user_id}
      />
    </Box>
  );
}
