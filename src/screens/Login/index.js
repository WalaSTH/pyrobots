import {
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Box,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import LoginForm from "../../components/FormsUI/LoginForm";
import Snackbar from "../../components/FormsUI/Snackbar";
import { useState } from "react";
import axios from "axios";

const loginEndpoint = "http://127.0.0.1:8000/token";
const resendEmailEndpoint = "http://127.0.0.1:8000/resend_validation";

export default function Login({ navigate }) {
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

  // Validation dialog
  const [openValidationDialog, setOpenValidationDialog] = useState(false);

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  async function resendValidationEmail(username) {
    setLoading(true);
    return await axios
      .post(resendEmailEndpoint, {
        username: username,
      })
      .then(function (response) {
        setLoading(false);
        setSeverity("success");
        setBody(response.data["detail"]);
        setOpen(true);
        openValidationDialog(false);
      })
      .catch(function (error) {
        setLoading(false);
        setSeverity("error");
        if (error.response) {
          setBody(error.response.data["detail"]);
        } else {
          setBody("Unknown error");
        }
        setOpen(true);
      });
  }

  // Login functions
  function handleLogin(t) {
    localStorage.setItem("token", t.access_token);
    localStorage.setItem("userID", t.id);
    localStorage.setItem("username", t.username);
    localStorage.setItem("avatar", t.avatar);
    navigate("/");
  }

  async function loginUser(credentials) {
    const params = new URLSearchParams();
    params.append("username", credentials.e.username);
    params.append("password", credentials.e.password);
    return await axios
      .post(loginEndpoint, params)
      .then((res) => {
        handleLogin(res.data);
      })
      .catch(function (error) {
        if (error.response.data["detail"] === "This account is not verified") {
          setUsername(credentials.e.username);
          setOpenValidationDialog(true);
        } else if (error.response) {
          setBody(error.response.data["detail"]);
          setSeverity("error");
          setOpen(true);
        } else {
          setBody("Unknown error");
          setSeverity("error");
          setOpen(true);
        }
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
      {openValidationDialog && (
        <Dialog open={openValidationDialog}>
          <DialogTitle>Not validated account</DialogTitle>
          <DialogContent>
            <Box display="flex">
              <DialogContentText sx={{ marginLeft: "10px" }}>
                Your account is not validated, check your email and validate
                your account. If you didn't receive an email click the resend
                button
              </DialogContentText>
            </Box>
          </DialogContent>
          <DialogActions>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Button
                variant="filled"
                sx={{ color: "primary.main" }}
                onClick={() => {
                  setOpenValidationDialog(false);
                }}
              >
                Close
              </Button>
              <Box display="flex" alignItems="center">
                <Button
                  variant="filled"
                  sx={{ color: "primary.main" }}
                  onClick={() => resendValidationEmail(username)}
                >
                  Resend validation email
                </Button>
                {loading && <CircularProgress color="primary" size="1rem" />}
              </Box>
            </Box>
          </DialogActions>
        </Dialog>
      )}
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
