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
    localStorage.setItem("UserID", t.id);
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
        const status = res.status;
        const data = res.data;
        if (status === 200) {
          handleLogin(data);
          return;
        }
      })
      .catch((error) => {
        if (!error || !error.response) setBody("No connection to server");
        else if (error.response.status === 401) {
          setBody("Username or password invalid");
        } else if (error.response.status === 422) {
          setBody("Bad request");
        } else if (error.response.status === 406) {
          setBody("Password do not match");
        } else if (error.response.status === 402) {
          setBody("Security failure");
        } else {
          setBody("Unknown error");
        }
        setOpen(true);
        setSeverity("error");
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
