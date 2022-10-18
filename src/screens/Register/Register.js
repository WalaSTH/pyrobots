import { Grid, Container, Typography, Box, Card, Button } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Textfield from "../../components/Textfield/Textfield";
import ButtonForm from "../../components/Button/ButtonForm";
import { useRef } from "react";
import PreviewImage from "../../components/PreviewImage/PreviewImage";
import axios from "axios";

const initialValues = {
  photo: null,
  username: "",
  email: "",
  password: "",
  passwordConfirmation: "",
};

const formValidation = Yup.object().shape({
  username: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .required("Please enter a password")
    .min(8, "Password too short")
    .test("isValidPass", " is not valid", (value) => {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSymbole = /[!@#%&]/.test(value);
      let validConditions = 0;
      const numberOfMustBeValidConditions = 3;
      const conditions = [hasLowerCase, hasUpperCase, hasNumber, hasSymbole];
      conditions.forEach((condition) => (condition ? validConditions++ : null));
      if (validConditions >= numberOfMustBeValidConditions) {
        return true;
      }
      return false;
    }),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

export default function RegisterForm() {
  const photoRef = useRef(null);

  const url = "http://127.0.0.1:8000/user/signup";

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Formik
          initialValues={{
            ...initialValues,
          }}
          validationSchema={formValidation}
          onSubmit={async (values) => {
            const fd = new FormData();
            fd.append("photo", values.photo);
            const response = await axios.post(url, fd, {
              headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
              },
              params: {
                username: values.username,
                password: values.password,
                email: values.email,
              },
            });
            return response;
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Card
                variant="outlined"
                sx={{ marginTop: 3, padding: 3, borderRadius: 3 }}
              >
                <Grid container spacing={2} sx={{ justifyContent: "center" }}>
                  <Grid item xs={12} sx={{ textAlign: "center" }}>
                    <Typography sx={{ fontSize: 18, fontWeight: 500 }}>
                      Registrarse
                    </Typography>
                  </Grid>
                  <Grid item>
                    <input
                      ref={photoRef}
                      id="inputAvatar"
                      hidden
                      name="photo"
                      type="file"
                      onChange={(e) => {
                        setFieldValue("photo", e.target.files[0]);
                      }}
                    />
                  </Grid>

                  <Grid>
                    <Grid item xs={12}>
                      {values.photo && <PreviewImage photo={values.photo} />}
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      fullWidth={true}
                      onClick={() => {
                        photoRef.current.click();
                      }}
                    >
                      Upload Avatar
                    </Button>
                  </Grid>

                  <Grid item xs={6}>
                    <Textfield name="username" label="Name" />
                  </Grid>

                  <Grid item xs={6}>
                    <Textfield name="email" label="Email" />
                  </Grid>

                  <Grid item xs={12}>
                    <Textfield
                      name="password"
                      label="Password"
                      type="password"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Textfield
                      name="passwordConfirmation"
                      label="Password"
                      type="password"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <ButtonForm>Crear partida</ButtonForm>
                  </Grid>
                </Grid>
              </Card>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}
