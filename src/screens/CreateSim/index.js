import { useState } from "react";
import { Container } from "@mui/material";
import CreateSimForm from "../../components/FormsUI/CreateSimForm";
import axios from "axios";
import Snackbar from "../../components/FormsUI/Snackbar";

export default function CreateSim({ username, navigate }) {
  // Snackbar utilities
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState("");

  function handleClose(reason) {
    if (reason === "clickaway") return;
    setOpen(false);
  }

  // Connection with endpoint
  async function handleSubmit(values) {
    return await axios
      .post("http://127.0.0.1:8000/simulation/start", {
        username: username,
        n_rounds: values.rounds,
        robot_names: values.robots.filter(function (e) {
          return e;
        }),
      })
      .then(function (response) {
        const simID = Date.now().toString();
        localStorage.setItem(simID, JSON.stringify(response));
        navigate(`/board/${simID}`);
      })
      .catch(function (error) {
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
  }

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        marginTop: 10,
      }}
    >
      <CreateSimForm onSubmit={handleSubmit} />

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
