import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Card } from "@mui/material";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import Textfield from "../FormsUI/Textfield";
import SubmitFormButton from "../FormsUI/SubmitFormButton";

const initialFormState = {
  username: "",
  password: "",
};

const formValidation = Yup.object().shape({
  username: Yup.string().max(250).required(),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
      "Must Contain 8 Characters, one Uppercase, one Lowercase and one Number"
    )
    .max(250)
    .required("Required"),
});

export default function LoginForm({ handleSubmit }) {
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "350px",
            marginTop: "150px",
          }}
        >
          <Formik
            initialValues={{ ...initialFormState }}
            validationSchema={formValidation}
            onSubmit={handleSubmit}
          >
            <Form>
              <Card
                variant="outlined"
                sx={{
                  marginTop: 3,
                  padding: 3,
                  borderRadius: 3,
                  textAlign: "center",
                }}
              >
                <Typography
                  component="h1"
                  variant="h5"
                  sx={{ color: "black", marginBottom: "20px" }}
                  data-testid="typography-signin"
                >
                  Sign in
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Textfield
                      name="username"
                      label="Username"
                      data-testid="username-input"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Textfield
                      name="password"
                      label="Password"
                      type="password"
                      data-testid="password-input"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <SubmitFormButton data-testid="login-button">
                      Login
                    </SubmitFormButton>
                  </Grid>

                  <Grid item xs={12}>
                    <Link href="/register" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Card>
            </Form>
          </Formik>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
