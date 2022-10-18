import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Routes from "./routes";
import Navbar from "./components/Navbar/Navbar";
import Leftbar from "./components/Leftbar/Leftbar";

export default function App() {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);

  function handleLogin() {
    setToken(1);
  }

  function handleLogout() {
    setToken(null);
  }

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
