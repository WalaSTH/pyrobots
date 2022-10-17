import {
  TextField as TField,
  Box,
  Container,
  Grid,
  Typography,
  Card,
  Avatar,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import TextField from "../FormsUI/TextField";
import FileUpload from "../FormsUI/FileUpload";
import SubmitButton from "../FormsUI/Button";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useState } from "react";

const INITIAL_FORM_STATE = {
  name: "",
  code: undefined,
  avatar: undefined,
};

const FORM_VALIDATION = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
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
  const [codeData, setCodeData] = useState("");
  const [avatarData, setAvatarData] = useState("");

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
          onSubmit={(name, ...values) => {
            const result = {
              name: name,
              code: codeData,
              avatar: avatarData,
            };
            alert(JSON.stringify(result, null, 4));
          }}
        >
          <Form>
            <Card
              variant="outlined"
              sx={{ marginTop: 3, padding: 3, borderRadius: 3 }}
            >
              <Grid
                container
                spacing={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Grid item xs={12} sx={{ textAlign: "center" }}>
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
                  <Field children name="avatar">
                    {({ field, meta }) => {
                      const fileReader = new FileReader();
                      fileReader.onloadend = () => {
                        setAvatarData(fileReader.result);
                      };
                      if (field.value) {
                        fileReader.readAsDataURL(field.value);
                      }
                      return (
                        <Avatar
                          src={
                            !meta.touched || (meta.touched && meta.error)
                              ? null
                              : avatarData
                          }
                          alt="Avatar"
                          sx={{
                            textAlign: "center",
                            width: "100px",
                            height: "100px",
                          }}
                        >
                          <SmartToyIcon
                            sx={{
                              width: "50px",
                              height: "50px",
                            }}
                          />
                        </Avatar>
                      );
                    }}
                  </Field>
                </Grid>

                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <TextField
                    name="name"
                    label="Robot Name"
                    autoComplete="off"
                    required
                  />
                </Grid>

                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <FileUpload
                    name="code"
                    title="Upload code"
                    accept=".py,text/x-python"
                  />

                  <Field className="code-field" name="code">
                    {({ field }) => {
                      const fileReader = new FileReader();
                      fileReader.onloadend = () => {
                        setCodeData(fileReader.result);
                      };
                      if (field.value) {
                        fileReader.readAsText(field.value);
                        return (
                          <TField
                            margin="dense"
                            variant="filled"
                            label={field.value.name}
                            value={codeData}
                            disabled={true}
                            multiline
                            maxRows={5}
                            fullWidth={true}
                            sx={{
                              textAlign: "center",
                            }}
                          />
                        );
                      }
                      return null;
                    }}
                  </Field>
                </Grid>

                <Grid item xs={12}>
                  <FileUpload
                    name="avatar"
                    title="Upload avatar"
                    accept="image/jpeg,image/png,image/jpg"
                  />
                </Grid>

                <Grid item xs={12}>
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
