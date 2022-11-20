import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import ResetPasswordForm from "../../components/FormsUI/ResetPasswordForm";
import axios from "axios";
import Snackbar from "../../components/FormsUI/Snackbar";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const resetPasswordEndpoint = "http://127.0.0.1:8000/user/reset_password";
const tokenStatusEndpoint = "http://127.0.0.1:8000/token/status";

export default function ResetPassword() {
  const navigate = useNavigate();

  // Fetch query params
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Check if token is expired
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    axios
      .get(tokenStatusEndpoint, {
        params: {
          token: token,
        },
      })
      .then(function () {
        setIsTokenValid(true);
      })
      .catch(function () {
        setIsTokenValid(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      .put(resetPasswordEndpoint, {
        token: token,
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
      <ResetPasswordForm
        handleSubmit={handleSubmit}
        isTokenValid={isTokenValid}
      />
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
