import {
  TextField as TField,
  Box,
  Container,
  Grid,
  Typography,
  Card,
  Avatar,
  Button,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import TextField from "../../components/FormsUI/TextField";
import FileUpload from "../../components/FormsUI/FileUpload";
import SubmitButton from "../../components/FormsUI/SubmitButton";
import AvatarPreview from "../../components/FormsUI/AvatarPreview";
import {
  SmartToy as SmartToyIcon,
  FileUpload as FileUploadIcon,
  AddAPhoto as AddAPhotoIcon,
} from "@mui/icons-material";
import { useState } from "react";
import FilePreview from "../../components/FormsUI/FilePreview";

const INITIAL_FORM_STATE = {
  name: "",
  code: {
    file: null,
    data: "",
  },
  avatar: {
    file: null,
    data: "",
  },
};

const FORM_VALIDATION = Yup.object().shape({
  name: Yup.string()
    .required("A name is required")
    .min(2, "Too short!")
    .max(20, "Too long!"),
  code: Yup.object({
    file: Yup.mixed()
      .required("No file selected")
      .test("fileEmpty", "File is empty", (value) => value && value.size > 0)
      .test(
        "fileFormat",
        "Unsopported file format",
        (value) => value && [".py", "text/x-python"].includes(value.type)
      ),
    data: Yup.string().required(""),
  }),
  avatar: Yup.object({
    file: Yup.mixed()
      .notRequired()
      .test(
        "fileFormat",
        "Unsopported file format",
        (value) =>
          !value ||
          (value &&
            ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
      ),
    data: Yup.string().notRequired(),
  }),
});

export default function NewRobot() {
  async function handleSubmit(values) {
    console.log(values);
  }

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        marginTop: 10,
      }}
    >
      <Formik
        initialValues={{ ...INITIAL_FORM_STATE }}
        initialTouched={{
          code: { file: true },
          avatar: { data: true },
        }}
        validationSchema={FORM_VALIDATION}
        onSubmit={handleSubmit}
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
                  name="avatar.data"
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
                  name="name"
                  label="Robot Name"
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
                }}
              >
                <FileUpload
                  accept=".py"
                  name="code"
                  buttonProps={{ startIcon: <FileUploadIcon /> }}
                >
                  Upload file
                </FileUpload>

                <FilePreview name="code.file" />
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
                <FileUpload
                  accept="image/*"
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
                <SubmitButton>Submit robot</SubmitButton>
              </Grid>
            </Grid>
          </Form>
        </Card>
      </Formik>
    </Container>
  );
}
