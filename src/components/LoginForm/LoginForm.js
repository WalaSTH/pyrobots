import { React } from "react";
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
import Button from "../FormsUI/Button";
import PropTypes from "prop-types";
import axios from "axios";

const INITIAL_FORM_STATE = {
  email: "",
  password: "",
};

const FORM_VALIDATION = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .test("len", "Must be more than 8 characters", (val) => {
      if (val) return val.length >= 8;
    })
    .test("includes", "Must contain a underscore", (val) => {
      if (val) return val.includes("_");
    })
    .required("Required"),
});

async function loginUser(credentials) {
  return axios.post("http://localhost:8080/login", credentials);
  // return fetch("http://localhost:8080/login", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(credentials),
  // });
}

export default function LoginForm({ setToken }) {
  // Pass the useFormik() hook initial form values and a submit function that will

  // be called when the form is submitted
  const theme = createTheme();

  const handleSubmit = async (e) => {
    const fetchedData = await loginUser({
      e,
    });
    // console.log(fetchedData);
    // if (fetchedData.status === 200) {
    //   console.log("to2 sali0 bn");
    //   setToken(fetchedData.data);
    //   return;
    // }
    // if (fetchedData.status === 400) {
    //   console.log("salio re mal bro");
    //   return;
    // }
    setToken(fetchedData);
  };

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
            marginBottom: "350px",
          }}
        >
          <Formik
            initialValues={{ ...INITIAL_FORM_STATE }}
            validationSchema={FORM_VALIDATION}
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
                >
                  Sign in
                </Typography>
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
              </Card>
            </Form>
          </Formik>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

LoginForm.propTypes = {
  setToken: PropTypes.func.isRequired,
};
