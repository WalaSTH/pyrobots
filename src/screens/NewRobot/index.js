import { useState } from "react";
import { Container } from "@mui/material";
import Snackbar from "../../components/FormsUI/Snackbar";
import NewRobotForm from "../../components/FormsUI/NewRobotForm";
import axios from "axios";

const endpoint = "http://127.0.0.1:8000/robot/create";

export default function NewRobot() {
  // Snackbar utilities
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState("");
  const userID = localStorage.getItem("userID");

  function handleClose(reason) {
    if (reason === "clickaway") return;
    setOpen(false);
  }

  // Convert file to base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      if (file) {
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      }
    });

  // Connection with endpoint
  async function handleSubmit(values, { resetForm }) {
    console.log(userID);
    const formData = new FormData();
    formData.append("robot_name", values.name);
    formData.append("creator", userID);
    formData.append("code", values.code);
    if (values.avatar) {
      formData.append("avatar", await toBase64(values.avatar));
    }

    return axios
      .post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        setOpen(true);
        setSeverity("success");
        setBody(response.data["detail"]);
        resetForm();
      })
      .catch(function (error) {
        setSeverity("error");
        if (error.response) {
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
