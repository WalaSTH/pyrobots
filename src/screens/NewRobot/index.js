import { useState } from "react";
import { Container } from "@mui/material";
import Snackbar from "../../components/FormsUI/Snackbar";
import NewRobotForm from "../../components/NewRobotForm";
import axios from "axios";

export default function NewRobot({ UserID }) {
  // Snackbar utilities
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState("");

  function handleClose(reason) {
    if (reason === "clickaway") return;
    setOpen(false);
  }

  // Connection with endpoint
  async function handleSubmit(values, { resetForm }) {
    const formData = new FormData();
    formData.append("code", values.code);
    formData.append("avatar", values.avatar);

    return axios
      .post("http://127.0.0.1:8000/robot/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: { robot_name: values.name, creator: UserID },
      })
      .then(function (response) {
        if (response.status === 200) {
          setSeverity("success");
          setBody("Succes!");
          resetForm({});
        } else if (response.status === 400) {
          setSeverity("error");
          setBody("Invalid robot name");
        } else if (response.status === 404) {
          setSeverity("error");
          setBody("Invalid user ID");
        }
        setOpen(true);
      })
      .catch(function (error) {
        setSeverity("error");
        setBody("Unknown error");
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
      <NewRobotForm onSubmit={handleSubmit} />

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
