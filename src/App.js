import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Routes from "./routes";
import Navbar from "./components/Navbar";
import Leftbar from "./components/Leftbar/Leftbar";

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
    <div className="App">
      <Navbar token={token} navigate={navigate} />
      <Grid container>
        {token && (
          <Grid item xs={2} order={1}>
            <Leftbar navigate={navigate} handleLogout={handleLogout} />
          </Grid>
        )}
        <Grid item xs={token ? 10 : 12} order={2}>
          <Routes
            token={token}
            setToken={setToken}
            navigate={navigate}
            handleLogin={handleLogin}
          />
        </Grid>
      </Grid>
    </div>
  );
}
