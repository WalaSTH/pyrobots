import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import TextField from "../TextField";
import SubmitFormButton from "../SubmitFormButton";
import { useNavigate } from "react-router-dom";

const initialFormState = {
  password: "",
  passwordConfirmation: "",
};

const formValidation = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
      "Must Contain 8 Characters, one Uppercase, one Lowercase and one Number"
    ),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

export default function ResetPasswordForm({ handleSubmit, isTokenValid }) {
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{ ...initialFormState }}
      validationSchema={formValidation}
      onSubmit={handleSubmit}
    >
      <Card
        variant="outlined"
        sx={{
          marginTop: 3,
          padding: 3,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        {isTokenValid && (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  component="h1"
                  variant="h5"
                  children="Reset your password"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="off"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="passwordConfirmation"
                  label="Confirm your password"
                  type="password"
                  autoComplete="off"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <SubmitFormButton data-testid="resetPassword-button">
                  Reset Password
                </SubmitFormButton>
              </Grid>
            </Grid>
          </Form>
        )}
        {!isTokenValid && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography component="h1" variant="h5" children="Link Expired" />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth="true"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Back to login
              </Button>
            </Grid>
          </Grid>
        )}
      </Card>
    </Formik>
  );
}
