// Form input and validation
import * as Yup from "yup";
import { Form, Formik } from "formik";

// Custom components for form input with formik and MUI
import AvatarPreview from "../FormsUI/AvatarPreview";
import FilePreview from "../FormsUI/FilePreview";
import FileUpload from "../FormsUI/FileUpload";
import SubmitButton from "../FormsUI/SubmitButton";
import TextField from "../FormsUI/Textfield";

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
    .min(2, "Must be at least 2 characters long")
    .max(20, "Must be at most 20 characters long")
    .matches(/^[0-9a-z ]+$/i, "Invalid characters"),
  code: Yup.mixed()
    .required("No file selected")
    .test(
      "codeFileFormat",
      "Unsupported file format",
      (value) => value && ["text/x-python"].includes(value.type)
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
      initialTouched={{
        code: true,
        avatar: true,
      }}
      validationSchema={formValidation}
      onSubmit={onSubmit}
    >
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
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <AvatarPreview
                name="avatar"
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
              }}
            >
              <TextField
                data-testid="robotNameInput"
                name="name"
                label="Robot Name"
                autoComplete="off"
                required
              />

              <FileUpload
                data-testid="robotAvatar"
                accept="image/png,image/jpg,image/jpeg"
                name="avatar"
                buttonProps={{ startIcon: <AddAPhotoIcon /> }}
              >
                Upload avatar
              </FileUpload>
            </Grid>

            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <FilePreview name="code" />

              <FileUpload
                data-testid="robotCodeInput"
                accept=".py"
                name="code"
                buttonProps={{ startIcon: <FileUploadIcon /> }}
              >
                Upload file
              </FileUpload>
            </Grid>

            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <SubmitButton data-testid="submitButton">
                Create robot
              </SubmitButton>
            </Grid>
          </Grid>
        </Form>
      </Card>
    </Formik>
  );
}
