import React from "react";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import TextField from "../TextField";
import SubmitFormButton from "../SubmitFormButton";

const initialFormState = {
  username: "",
  password: "",
};

const formValidation = Yup.object().shape({
  username: Yup.string()
    .min(3, "Must be at least 3 characters long")
    .max(16, "Username can't be longer than 16 characters"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
      "Must Contain 8 Characters, one Uppercase, one Lowercase and one Number"
    )
    .max(250),
});

export default function LoginForm({ handleSubmit }) {
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
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                component="h1"
                variant="h5"
                data-testid="typography-signin"
              >
                Sign in
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="username"
                label="Username"
                autoComplete="off"
                required
                data-testid="username-input"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="password"
                label="Password"
                type="password"
                autoComplete="off"
                required
                data-testid="password-input"
              />
            </Grid>
            <Grid item xs={12}>
              <SubmitFormButton data-testid="login-button">
                Login
              </SubmitFormButton>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{ marginRight: 1 }}>
                  <Link href="/recover?type=username" variant="body2">
                    Forgot username?
                  </Link>
                </Box>
                ·
                <Box sx={{ marginLeft: 1 }}>
                  <Link href="/recover?type=password" variant="body2">
                    Forgot password?
                  </Link>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Link href="/register" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Form>
      </Card>
    </Formik>
  );
}
