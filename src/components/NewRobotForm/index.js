// Form input and validation
import * as Yup from "yup";
import { Form, Formik } from "formik";

// Custom components for form input with formik and MUI
import AvatarPreview from "../FormsUI/AvatarPreview";
import FilePreview from "../FormsUI/FilePreview";
import FileUpload from "../FormsUI/FileUpload";
import SubmitButton from "../FormsUI/SubmitButton";
import TextField from "../FormsUI/TextField";

// MUI components
import { Card, Grid, Typography } from "@mui/material";

// MUI icons
import {
  AddAPhoto as AddAPhotoIcon,
  FileUpload as FileUploadIcon,
  SmartToy as SmartToyIcon,
} from "@mui/icons-material";

const INITIAL_FORM_STATE = {
  name: "",
  code: null,
  avatar: null,
};

const FORM_VALIDATION = Yup.object().shape({
  name: Yup.string()
    .required("A name is required")
    .min(2, "Too short!")
    .max(20, "Too long!")
    .test(
      "isAlphanumeric",
      "Invalid character",
      (value) => value && value.match(/^[0-9a-z]+$/i)
    ),
  code: Yup.mixed()
    .required("No file selected")
    .test(
      "codeFormat",
      "Unsopported file format",
      (value) => value && ["text/x-python"].includes(value.type)
    ),
  avatar: Yup.mixed()
    .notRequired()
    .test(
      "avatarFormat",
      "Unsopported file format",
      (value) =>
        !value ||
        (value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
    ),
});

export default function NewRobotForm({ onSubmit }) {
  return (
    <Formik
      initialValues={{ ...INITIAL_FORM_STATE }}
      initialTouched={{
        code: true,
        avatar: true,
      }}
      validationSchema={FORM_VALIDATION}
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
