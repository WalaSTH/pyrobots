// Form input and validation
import * as Yup from "yup";
import { Form, Formik } from "formik";

// Custom components for form input with formik and MUI
import AvatarPreview from "../AvatarPreview";
import FilePreview from "../FilePreview";
import FileUploadButton from "../FileUploadButton";
import SubmitFormButton from "../SubmitFormButton";
import TextField from "../TextField";

// MUI components
import { Card, Grid, Typography } from "@mui/material";

// MUI icons
import {
  AddAPhoto as AddAPhotoIcon,
  FileUpload as FileUploadIcon,
  SmartToy as SmartToyIcon,
} from "@mui/icons-material";

const initialFormState = {
  name: "",
  code: "",
  avatar: "",
};

const formValidation = Yup.object().shape({
  name: Yup.string()
    .required("A name is required")
    .min(3, "Must be at least 3 characters long")
    .max(16, "Must be at most 16 characters long")
    .matches(/^[0-9a-z ]+$/i, "Invalid characters"),
  code: Yup.mixed()
    .required("No file selected")
    .test(
      "codeFileFormat",
      "Unsupported file format",
      (value) =>
        value && ["text/x-python", "text/x-python-script"].includes(value.type)
    ),
  avatar: Yup.mixed()
    .notRequired()
    .test(
      "avatarFileFormat",
      "Unsupported file format",
      (value) =>
        !value ||
        (value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
    ),
});

export default function NewRobotForm({ onSubmit }) {
  return (
    <Formik
      initialValues={{ ...initialFormState }}
      validationSchema={formValidation}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={onSubmit}
    >
      {(values) => (
        <Card
          variant="outlined"
          sx={{
            marginTop: 3,
            padding: 3,
            borderRadius: 3,
          }}
        >
          <Form>
            <Grid
              container
              spacing={2}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Grid
                item
                xs={12}
                sx={{
                  textAlign: "center",
                }}
              >
                <Typography component="h1" variant="h5">
                  New Robot
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: -0.5,
                  marginBottom: -0.5,
                }}
              >
                <AvatarPreview
                  name="avatar"
                  alt={values.name}
                  sx={{
                    height: "100px",
                    width: "100px",
                    textAlign: "center",
                  }}
                >
                  <SmartToyIcon
                    sx={{
                      height: "50px",
                      width: "50px",
                      textAlign: "center",
                    }}
                  />
                </AvatarPreview>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: -0.5,
                  marginBottom: -0.5,
                }}
              >
                <TextField
                  data-testid="robotNameInput"
                  name="name"
                  label="Name"
                  autoComplete="off"
                  required
                />
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: -0.5,
                  marginBottom: -0.5,
                }}
              >
                <FilePreview name="code" />

                <FileUploadButton
                  id="robotCodeInput"
                  name="code"
                  data-testid="robotCodeInput"
                  inputProps={{ accept: ".py" }}
                  buttonProps={{ startIcon: <FileUploadIcon /> }}
                >
                  Select file
                </FileUploadButton>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: -0.5,
                  marginBottom: -0.5,
                }}
              >
                <FileUploadButton
                  id="robotAvatarInput"
                  name="avatar"
                  data-testid="robotAvatar"
                  inputProps={{ accept: "image/png,image/jpg,image/jpeg" }}
                  buttonProps={{ startIcon: <AddAPhotoIcon /> }}
                >
                  Select avatar
                </FileUploadButton>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: 0.5,
                }}
              >
                <SubmitFormButton data-testid="submitButton">
                  Create robot
                </SubmitFormButton>
              </Grid>
            </Grid>
          </Form>
        </Card>
      )}
    </Formik>
  );
}
