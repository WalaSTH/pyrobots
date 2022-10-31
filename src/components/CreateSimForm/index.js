// Form input and validation
import * as Yup from "yup";
import { Form, Formik } from "formik";

// Custom components for form input with formik and MUI
import TextField from "../FormsUI/TextField";
import SubmitFormButton from "../FormsUI/SubmitFormButton";

// MUI components
import { Card, Grid, Typography } from "@mui/material";

const initialFormState = {
  rounds: "",
  robot_ids: [1, 2],
};

const formValidation = Yup.object().shape({
  rounds: Yup.number()
    .integer()
    .typeError("Must be a valid number")
    .positive("Must be a positive number")
    .max(10000, "Max number of rounds is 10000")
    .required("Required"),
});

export default function CreateSimForm({ onSubmit }) {
  return (
    <Card
      variant="outlined"
      sx={{
        marginTop: 3,
        padding: 3,
        borderRadius: 3,
      }}
    >
      <Formik
        initialValues={{ ...initialFormState }}
        validationSchema={formValidation}
        onSubmit={onSubmit}
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
              <Typography
                mt={1}
                mb={1}
                sx={{
                  fontSize: { xs: "1rem", sm: "1.25rem", md: "1.50rem" },
                }}
              >
                Create Simulation
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
              <TextField
                name="rounds"
                label="Rounds"
                placeholder="10000"
                autoComplete="off"
                required={true}
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
              <SubmitFormButton>Run simulation</SubmitFormButton>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </Card>
  );
}
