import * as Yup from "yup";
import { Form, Formik } from "formik";
import axios from "axios";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import TextField from "../FormsUI/TextField";

const initialFormState = {
  currentPassword: "",
  newPassword: "",
  newPasswordConfirmation: "",
};

const formValidation = Yup.object().shape({
  currentPassword: Yup.string()
    .required("This field is required")
    .min(8, "Incorrect password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
      "Incorrect password"
    ),
  newPassword: Yup.string()
    .required("This field is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
      "Must contain 8 characters, one uppercase, one lowercase and one number"
    ),
  newPasswordConfirmation: Yup.string()
    .required("This field is required")
    .oneOf([Yup.ref("newPassword"), null], "Passwords don't match"),
});

export default function ChangePasswordDialog({
  open = true,
  onClose,
  username,
  snackbarProps,
}) {
  async function handleSubmit(values, { setErrors }) {
    const { setOpen, setSeverity, setBody } = snackbarProps;
    return await axios
      .put("http://127.0.0.1:8000/user/update", {
        username: username,
        param: "password",
        new_pwd: values.newPassword,
        current_pwd: values.currentPassword,
      })
      .then(function (response) {
        onClose();
        setOpen(true);
        setSeverity("success");
        setBody(response.data.detail);
      })
      .catch(function (error) {
        if (error.response && error.response.status === 401) {
          setErrors({ currentPassword: "Incorrect password" });
        } else {
          onClose();
          setSeverity("error");
          if (
            error.response &&
            typeof error.response.data["detail"] != "object"
          ) {
            setBody(error.response.data["detail"]);
          } else {
            setBody("Unknown error");
          }
          setOpen(true);
        }
      });
  }

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Formik
        initialValues={{ ...initialFormState }}
        validationSchema={formValidation}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        <Form>
          <DialogTitle color="primary">Change password</DialogTitle>
          <DialogContent>
            <Grid
              container
              spacing={2}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Grid item xs={12} mb={-1}>
                <Typography
                  sx={{
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                >
                  Enter your current password and a new password.
                </Typography>
              </Grid>

              <Grid item xs={12} mt={2}>
                <Typography
                  color="primary"
                  sx={{
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                >
                  Current password
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  marginBottom: -0.5,
                }}
              >
                <TextField
                  name="currentPassword"
                  label="Password"
                  type="password"
                  autoComplete="off"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  color="primary"
                  sx={{
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                >
                  New password
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  marginTop: 0.5,
                  marginBottom: -0.5,
                }}
              >
                <TextField
                  name="newPassword"
                  label="Password"
                  type="password"
                  autoComplete="off"
                  required
                />
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  marginTop: 0.5,
                  marginBottom: -0.5,
                }}
              >
                <TextField
                  name="newPasswordConfirmation"
                  label="Confirm password"
                  type="password"
                  autoComplete="off"
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Box display="flex" width="100%" justifyContent="space-between">
              <Button autoFocus color="error" onClick={onClose}>
                Cancel
              </Button>

              <Button type="submit">Update</Button>
            </Box>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
}
