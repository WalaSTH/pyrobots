import { Grid, Container, Typography, Box, Card, Button } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextField from "../../components/FormsUI/TextField";
import SubmitFormButton from "../../components/FormsUI/SubmitFormButton";
import { useRef, useState } from "react";
import PreviewImage from "../../components/FormsUI/PreviewImage";
import axios from "axios";
import Snackbar from "../../components/FormsUI/Snackbar";

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

const url = "http://127.0.0.1:8000/user/signup";

export default function RegisterForm() {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState("");

  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const photoRef = useRef(null);

  const handleSendData = async (values) => {
    let fd = null;
    const config = {
      params: {
        username: values.username,
        password: values.password,
        email: values.email,
      },
    };
    if (values.photo) {
      fd = new FormData();
      fd.append("photo", values.photo);
      config.headers = {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      };
    }
    return await axios
      .post(url, fd, config)
      .then(function (response) {
        setOpen(true);
        setSeverity("success");
        setBody(response.data["detail"]);
      })
      .catch(function (error) {
        setSeverity("error");
        if (error.response) {
          setBody(error.response.data["detail"]);
        } else {
          setBody("Unknown error");
        }
        setOpen(true);
      });
  };
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
          onSubmit={handleSendData}
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
                      Register
                    </Typography>
                  </Grid>
                  <Grid item>
                    <input
                      ref={photoRef}
                      id="inputAvatar"
                      hidden
                      name="photo"
                      type="file"
                      onChange={({ target: { files } }) => {
                        setFieldValue("photo", files[0]);
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
                    <TextField name="username" label="Name" />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField name="email" label="Email" />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      name="password"
                      label="Password"
                      type="password"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      name="passwordConfirmation"
                      label="Password"
                      type="password"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <SubmitFormButton>Crear partida</SubmitFormButton>
                  </Grid>
                </Grid>
              </Card>
            </Form>
          )}
        </Formik>
        {open && (
          <Snackbar
            open={open}
            body={body}
            severity={severity}
            handleClose={handleClose}
          />
        )}
      </Box>
    </Container>
  );
}
