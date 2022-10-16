import { Grid, Container, Typography, Box, Card, Button } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Textfield from "../../components/Textfield/Textfield";
import ButtonForm from "../../components/Button/ButtonForm";
import { useRef } from "react";
import PreviewImage from "../../components/PreviewImage/PreviewImage";
import axios from "axios";

const initialValues = {
  file: null,
  username: "",
  email: "",
  password: "",
};

const formValidation = Yup.object().shape({
  username: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

export default function CreateGame() {
  const fileRef = useRef(null);
  const url = "https://634ab9a333bb42dca409da46.mockapi.io/api/Register";

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
            const response = await axios.post(url, values);
            console.log(values);
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
                      ref={fileRef}
                      hidden
                      id="inputAvatar"
                      name="file"
                      type="file"
                      onChange={(e) => {
                        setFieldValue("file", e.target.files[0]);
                      }}
                    />
                  </Grid>

                  <Grid>
                    <Grid item xs={12}>
                      {values.file && <PreviewImage file={values.file} />}
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      onClick={() => {
                        fileRef.current.click();
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
                    <Textfield name="password" label="Password" />
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
