import { useState } from "react";
import { Container } from "@mui/material";
import CreateSimForm from "../../components/CreateSimForm";
import axios from "axios";
import Snackbar from "../../components/FormsUI/Snackbar";

export default function CreateSim({ username }) {
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
    console.log(values);

    return await axios
      .get("http://127.0.0.1:8000/simulation/start", {
        params: {
          username: username,
          n_rounds: values.rounds,
          robot_list: values.robot_ids,
        },
      })
      .then(function (response) {
        setOpen(true);
        setSeverity("success");
        setBody(response.data["detail"]);
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
