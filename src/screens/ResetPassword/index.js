import { useState } from "react";
import { Container } from "@mui/material";
import ResetPasswordForm from "../../components/FormsUI/ResetPasswordForm";
import axios from "axios";
import Snackbar from "../../components/FormsUI/Snackbar";
import { useNavigate } from "react-router-dom";

// const endpoint = "http://127.0.0.1:8000/user/reset_password";

export default function ResetPassword() {
  const navigate = useNavigate();

  // Fetch query params (TODO)
  // const [searchParams] = useSearchParams();
  // const user = searchParams.get("user");

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
      .put("https://634ab9a333bb42dca409da46.mockapi.io/api/reset-password/1", {
        user: "token test",
        password: values.password,
      })
      .then(function () {
        navigate("/login");
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
      <ResetPasswordForm handleSubmit={handleSubmit} />
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
