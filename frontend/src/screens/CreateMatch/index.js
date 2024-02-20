import CreateMatchForm from "../../components/FormsUI/CreateMatchForm";
import { Container } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Snackbar from "../../components/FormsUI/Snackbar";

export default function CreateGame({ userID }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState("");

  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  async function handleSubmit(values) {
    await axios
      .post("http://127.0.0.1:8000/match/create", values)
      .then(function (response) {
        navigate(`/lobby/${response.data["id"]}`);
      })
      .catch(function (error) {
        if (
          error.response &&
          typeof error.response.data["detail"] != "object"
        ) {
          setBody(error.response.data["detail"]);
        } else {
          setBody("Unknown error");
        }
        setOpen(true);
        setSeverity("error");
      });
  }
  return (
    <Container component="main" maxWidth="xs">
      <CreateMatchForm userID={userID} handleSubmit={handleSubmit} />
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
