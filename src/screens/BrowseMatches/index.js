import { Container, Card, Button } from "@mui/material";
import { useState } from "react";
import Snackbar from "../../components/FormsUI/Snackbar";
import axios from "axios";
import TableBasic from "../../components/LobbyList";
import FilterButton from "../../components/FilterButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function BrowseMatches() {
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState("available");
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState("");

  const username = localStorage.getItem("username");

  const endpoint = "http://127.0.0.1:8000/match/list";

  async function getData() {
    await axios
      .get(endpoint, {
        params: {
          name: username,
          filter: filter,
        },
      })
      .then((response) => {
        const data = response.data;
        setMatches(data);
      })
      .catch((error) => {
        setOpen(true);
        setSeverity("error");
        setBody(error.response.data["detail"]);
      });
  }

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
        <Button onClick={getData} startIcon={<RefreshIcon />}>
          Refresh
        </Button>
        <FilterButton setFilter={setFilter} endIcon={<FilterListIcon />} />
      </Card>
      <TableBasic matches={matches} getData={getData} filter={filter} />
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
