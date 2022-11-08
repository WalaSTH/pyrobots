import { useState } from "react";
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
import RecoverForm from "../../components/FormsUI/RecoverForm";
import axios from "axios";
import Snackbar from "../../components/FormsUI/Snackbar";
import { useNavigate, useSearchParams } from "react-router-dom";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

// const endpoint = "http://127.0.0.1:8000/recover_email";

export default function Recover() {
  const navigate = useNavigate();

  // Fetch query params
  const [searchParams] = useSearchParams();
  const recoverType = searchParams.get("type");

  // Email sent dialog
  const [dialogOpen, setDialogOpen] = useState(false);

  // Snackbar utilities
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState("");

  function handleSnackbarClose(reason) {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  }

  // Connection with endpoint
  async function handleSubmit(values) {
    return await axios
      .post("https://634ab9a333bb42dca409da46.mockapi.io/api/recover_mail", {
        email: values.email,
        type: recoverType,
      })
      .then(function () {
        setDialogOpen(true);
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
        setSnackbarOpen(true);
      });
  }

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <RecoverForm handleSubmit={handleSubmit} type={recoverType} />
      {dialogOpen && (
        <Dialog open={dialogOpen}>
          <DialogTitle>Email sent</DialogTitle>
          <DialogContent>
            <Box display="flex">
              <MarkEmailReadIcon />
              <DialogContentText sx={{ marginLeft: "10px" }}>
                We sent you an email with the recovery information, please check
                it out!
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
                Back to login
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      )}
      {snackbarOpen && (
        <Snackbar
          open={snackbarOpen}
          body={body}
          severity={severity}
          handleClose={handleSnackbarClose}
        />
      )}
    </Container>
  );
}
