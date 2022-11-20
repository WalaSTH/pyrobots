import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Box } from "@mui/system";
import { LinearProgress } from "@mui/material";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import TextField from "../TextField";
import SubmitFormButton from "../SubmitFormButton";

const initialFormState = {
  email: "",
};

const formValidation = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

export default function RecoverForm({ handleSubmit, type, loading }) {
  return (
    <Formik
      initialValues={{ ...initialFormState }}
      validationSchema={formValidation}
      onSubmit={handleSubmit}
    >
      <Card
        variant="outlined"
        sx={{
          marginTop: 3,
          padding: 3,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                component="h1"
                variant="h5"
                children={
                  type === "password"
                    ? "Reset your password"
                    : "Recover your username"
                }
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
              <SubmitFormButton
                data-testid="recover-button"
                sx={{ display: "flex", justifyContent: "center" }}
              >
                {type === "password" ? "Reset Password" : "Recover Username"}
              </SubmitFormButton>
              {loading && (
                <Box sx={{ width: "100%" }}>
                  <LinearProgress color="secondary" />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <Link href="/login" variant="body2">
                Return to login
              </Link>
            </Grid>
          </Grid>
        </Form>
      </Card>
    </Formik>
  );
}
