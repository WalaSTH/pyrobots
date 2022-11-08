import { Container } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import Snackbar from "../../components/FormsUI/Snackbar";
import RegisterUserForm from "../../components/FormsUI/RegisterForm";
import { useNavigate } from "react-router-dom";

const endpoint = "http://127.0.0.1:8000/user/signup";

export default function RegisterForm() {
  const navigate = useNavigate();

  // Snackbar utilities
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState("");

  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // Convert file to base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  async function handleSubmit(values) {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("password", values.password);
    formData.append("email", values.email);
    if (values.avatar) {
      formData.append("avatar", await toBase64(values.avatar));
    }

    await axios
      .post(endpoint, formData)
      .then(function () {
        navigate("/login");
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
      sx={{ display: "flex", alignItems: "center", marginTop: 3 }}
    >
      <RegisterUserForm handleSubmit={handleSubmit} />
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
