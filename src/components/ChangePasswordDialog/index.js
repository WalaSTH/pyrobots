import * as Yup from "yup";
import { Form, Formik } from "formik";

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
  open,
  onClose,
  username,
  snackbarProps,
}) {
  function handleSubmit() {
    onClose();
  }

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Formik
        initialValues={{ ...initialFormState }}
        validationSchema={formValidation}
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
