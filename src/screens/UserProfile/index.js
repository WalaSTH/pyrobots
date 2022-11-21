// import { Container } from "@mui/material";
// import DisplayProfile from "../../components/DisplayProfile";

import { Container } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Snackbar from "../../components/FormsUI/Snackbar";
import ProfileCard from "../../components/ProfileCard";

export default function UserProfile() {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState("");

  function handleClose(reason) {
    if (reason === "clickaway") return;
    setOpen(false);
  }

  const username = localStorage.getItem("username");
  const avatar = localStorage.getItem("avatar");
  const [stats, setStats] = useState(null);

  async function fetchStats(username) {
    return await axios.get("http://127.0.0.1:8000/users/stats", {
      params: {
        checked_user: username,
      },
    });
  }

  useEffect(() => {
    fetchStats(username)
      .then((res) => {
        setStats(res.data.stats);
      })
      .catch((error) => {
        setSeverity("error");
        if (
          error.response &&
          typeof error.response.data["detail"] != "object"
        ) {
          setBody(error.response.data["detail"]);
        } else {
          setBody("Unknown error");
        }
        setOpen(true);
      });
  }, [username]);

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        marginTop: 10,
      }}
    >
      <ProfileCard username={username} avatar={avatar} stats={stats} />

      {open && (
        <Snackbar
          data-testid="profileSnackbar"
          open={open}
          body={body}
          severity={severity}
          handleClose={handleClose}
        />
      )}
    </Container>
  );
}
