import { Box, Container, Grid, Typography, Card } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextField from "../FormsUI/TextField";
import FileUpload from "../FormsUI/FileUpload";
import SubmitButton from "../FormsUI/Button";
import { useRef } from "react";

const INITIAL_FORM_STATE = {
  name: "",
  code: "",
  avatar: "",
};

const FORM_VALIDATION = Yup.object().shape({
  name: Yup.string()
    .required("Robot name is required")
    .min(2, "Too short")
    .max(20, "Too long"),
  code: Yup.mixed().required("Source code is required"),
  avatar: Yup.mixed(),
});

export default function NewRobotForm() {
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
          initialValues={{ ...INITIAL_FORM_STATE }}
          validationSchema={FORM_VALIDATION}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          <Form>
            <Card
              variant="outlined"
              sx={{ marginTop: 3, padding: 3, borderRadius: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Typography component="h1" variant="h5">
                    New Robot
                  </Typography>
                </Grid>

                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <TextField
                    name="name"
                    label="Robot Name"
                    autoComplete="off"
                  />
                </Grid>

                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <FileUpload name="code" accept=".py" />
                </Grid>

                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <FileUpload name="avatar" accept="image/*" />
                </Grid>

                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <SubmitButton> Create robot </SubmitButton>
                </Grid>
              </Grid>
            </Card>
          </Form>
        </Formik>
      </Box>
    </Container>
  );
}
