import LoginForm from "../../components/FormsUI/LoginForm";
import Snackbar from "../../components/FormsUI/Snackbar";
import Container from "@mui/material/Container";
import { useState } from "react";
import axios from "axios";

export default function Login({ navigate }) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState("");

  function handleLogin(t) {
    localStorage.setItem("token", t.access_token);
    localStorage.setItem("userID", t.id);
    localStorage.setItem("username", t.username);
    localStorage.setItem("avatar", t.avatar);
    navigate("/");
  }

  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  async function loginUser(credentials) {
    const params = new URLSearchParams();
    params.append("username", credentials.e.username);
    params.append("password", credentials.e.password);
    return await axios
      .post("http://127.0.0.1:8000/token", params)
      .then((res) => {
        handleLogin(res.data);
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

  const handleSubmit = async (e) => {
    await loginUser({
      e,
    });
  };
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        marginTop: 20,
      }}
    >
      <LoginForm handleSubmit={handleSubmit} />
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
