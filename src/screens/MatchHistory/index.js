import { Container, Card, Button } from "@mui/material";
import { useState, useEffect } from "react";
import Snackbar from "../../components/FormsUI/Snackbar";
import axios from "axios";
import MatchHistoryList from "../../components/MatchHistoryList";
import RefreshIcon from "@mui/icons-material/Refresh";

const endpoint = "http://127.0.0.1:8000/match/list";

export default function BrowseMatches() {
  const [matches, setMatches] = useState([]);
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState("");

  const username = localStorage.getItem("username");

  async function getPlayedMatches() {
    await axios
      .get(endpoint, {
        params: {
          name: username,
          filter: "finished",
        },
      })
      .then((response) => {
        setMatches(response.data);
      })
      .catch((error) => {
        setOpen(true);
        setSeverity("error");
        setBody(error.response.data["detail"]);
      });
  }

  useEffect(() => {
    getPlayedMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose(reason) {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  }

  return (
    <Container sx={{ marginTop: { xs: 9, md: 4 } }}>
      <Card
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          backgroundColor: "#efefef",
        }}
      >
        <Button onClick={getPlayedMatches} startIcon={<RefreshIcon />}>
          Refresh
        </Button>
      </Card>
      <MatchHistoryList matches={matches} />
      {open && (
        <Snackbar
          open={open}
          body={body}
          severity={severity}
          handleClose={handleClose}
        />
      )}
    </Container>
  );
}
