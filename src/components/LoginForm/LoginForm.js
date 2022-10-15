import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import Textfield from "../FormsUI/Textfield";
import Button from "../FormsUI/Button";

const INITIAL_FORM_STATE = {
  email: "",
  password: "",
};

const FORM_VALIDATION = Yup.object().shape({
  email: Yup.string().email("Invalid email!").required("Required"),
  password: Yup.string()
    .test("len", "Must be more than 8 characters", (val) => {
      if (val) return val.length >= 8;
    })
    .test("includes", "Must contain a underscore", (val) => {
      if (val) return val.includes("_");
    })
    .required("Required"),
});

export default function LoginForm() {
  // Pass the useFormik() hook initial form values and a submit function that will

  // be called when the form is submitted
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5" sx={{ color: "black" }}>
            Sign in
          </Typography>
          <Formik
            initialValues={{ ...INITIAL_FORM_STATE }}
            validationSchema={FORM_VALIDATION}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Textfield
                    name="email"
                    label="Email"
                    // margin="normal"
                    // fullWidth
                    // id="email"
                    // type="email"
                    // onChange={formik.handleChange}
                    // value={formik.values.email}
                    // autoComplete="email"
                    // autoFocus
                  />
                </Grid>

                <Grid item xs={12}>
                  <Textfield
                    name="password"
                    label="Password"
                    type="password"
                    // margin="normal"
                    // fullWidth
                    // id="password"
                    // type="password"
                    // onChange={formik.handleChange}
                    // value={formik.values.password}
                    // autoComplete="current-password"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button type="submit">Login</Button>
                  {/* <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button> */}
                </Grid>

                <Grid item xs={12}>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
