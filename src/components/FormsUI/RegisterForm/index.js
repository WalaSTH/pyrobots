// Form input and validation
import * as Yup from "yup";
import { Form, Formik } from "formik";

// Custom components for form input with formik and MUI
import AvatarPreview from "../../FormsUI/AvatarPreview";
import FileUploadButton from "../../FormsUI/FileUploadButton";
import SubmitFormButton from "../../FormsUI/SubmitFormButton";
import TextField from "../../FormsUI/TextField";

// MUI components
import { Card, Grid, Typography } from "@mui/material";

// MUI icons
import PersonIcon from "@mui/icons-material/Person";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

const initialFormState = {
  photo: null,
  username: "",
  email: "",
  password: "",
  passwordConfirmation: "",
};

const formValidation = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters long")
    .max(16, "Username can't be longer than 16 characters"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
      "Must Contain 8 Characters, one Uppercase, one Lowercase and one Number"
    ),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

export default function RegisterUserForm({ handleSubmit }) {
  return (
    <Formik
      initialValues={{
        ...initialFormState,
      }}
      validationSchema={formValidation}
      onSubmit={handleSubmit}
    >
      <Card
        variant="outlined"
        sx={{ marginTop: 3, padding: 3, borderRadius: 3 }}
      >
        <Form>
          <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography component="h1" variant="h5">
                Register
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
                sx={{
                  height: "100px",
                  width: "100px",
                  textAlign: "center",
                }}
              >
                <PersonIcon
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
              <FileUploadButton
                id="userAvatarInput"
                name="avatar"
                accept="image/png,image/jpg,image/jpeg"
                data-testid="userAvatar"
                inputProps={{ accept: "image/png,image/jpg,image/jpeg" }}
                buttonProps={{ startIcon: <AddAPhotoIcon /> }}
              >
                Select avatar
              </FileUploadButton>
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="username"
                label="Name"
                autoComplete="off"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                autoComplete="off"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="password"
                label="Password"
                type="password"
                autoComplete="off"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="passwordConfirmation"
                label="Password"
                type="password"
                autoComplete="off"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <SubmitFormButton>Register</SubmitFormButton>
            </Grid>
          </Grid>
        </Form>
      </Card>
    </Formik>
  );
}
