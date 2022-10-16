import { Box, Container, Grid, Typography, Card } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextField from "../FormsUI/TextField";
import FileUpload from "../FormsUI/FileUpload";
import SubmitButton from "../FormsUI/Button";

const INITIAL_FORM_STATE = {
  name: "",
  code: "",
  avatar: "",
};

const FORM_VALIDATION = Yup.object().shape({
  name: Yup.string()
    .required("A name is required")
    .min(2, "Name is too short")
    .max(20, "Name is too long"),
  code: Yup.mixed()
    .required("Source code is required")
    .test(
      "fileType",
      "File is not supported",
      (value) => value && [".py", "text/x-python"].includes(value.type)
    ),
  avatar: Yup.mixed()
    .notRequired()
    .test(
      "fileType",
      "File is not supported",
      (value) =>
        !value ||
        (value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
    ),
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
                  <FileUpload
                    name="code"
                    title="Upload code"
                    accept=".py,text/x-python"
                  />
                </Grid>

                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <FileUpload
                    name="avatar"
                    title="Upload avatar"
                    accept="image/jpeg,image/png,image/jpg"
                  />
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
