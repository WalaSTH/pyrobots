import {
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Box,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import Snackbar from "../../components/FormsUI/Snackbar";
import RegisterUserForm from "../../components/FormsUI/RegisterForm";
import { useNavigate } from "react-router-dom";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

const endpoint = "http://127.0.0.1:8000/user/signup";

export default function RegisterForm() {
  const navigate = useNavigate();

  // Loading bar after submitting the form
  const [loading, setLoading] = useState(false);

  // Verify account dialog
  const [dialogOpen, setDialogOpen] = useState(false);

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
    setLoading(true);
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
        setLoading(false);
        setDialogOpen(true);
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

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 10 }}>
      <RegisterUserForm handleSubmit={handleSubmit} loading={loading} />
      {dialogOpen && (
        <Dialog open={dialogOpen}>
          <DialogTitle>Email sent</DialogTitle>
          <DialogContent>
            <Box display="flex">
              <MarkEmailReadIcon />
              <DialogContentText sx={{ marginLeft: "10px" }}>
                We sent you an email with the validation link, please check it
                out!
              </DialogContentText>
            </Box>
          </DialogContent>
          <DialogActions>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Button
                variant="filled"
                sx={{ color: "primary.main" }}
                onClick={() => {
                  setDialogOpen(false);
                }}
              >
                Close
              </Button>
              <Button
                variant="filled"
                sx={{ color: "primary.main" }}
                onClick={() => {
                  setDialogOpen(false);
                  navigate("/login");
                }}
              >
                Go to login
              </Button>
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
