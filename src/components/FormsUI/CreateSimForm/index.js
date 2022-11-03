// Form input and validation
import * as Yup from "yup";
import { Form, Formik } from "formik";

// Custom components for form input with formik and MUI
import TextField from "../TextField";
import SubmitFormButton from "../SubmitFormButton";
import SelectRobot from "../SelectRobot";

// MUI components
import { Card, FormHelperText, Grid, Typography } from "@mui/material";
import { useState } from "react";

const initialFormState = {
  rounds: "",
  robots: ["", "", "", ""],
};

const MIN_ROBOTS_ERROR = "Select at least 2 robots";

const formValidation = Yup.object().shape({
  rounds: Yup.number()
    .integer()
    .typeError("Must be a valid number")
    .positive("Must be a positive number")
    .max(10000, "Max number of rounds is 10000")
    .required("Required"),
  robots: Yup.array().test("minRobots", MIN_ROBOTS_ERROR, (array) => {
    return (
      array.filter(function (e) {
        return e;
      }).length > 1
    );
  }),
});

export default function CreateSimForm({ onSubmit }) {
  const [isSelectError, setIsSelectError] = useState(false);

  function handleError() {
    setIsSelectError(true);
  }

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
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              sx={{
                textAlign: "center",
              }}
            >
              <Typography mt={1} mb={1} component="h1" variant="h5">
                Create Simulation
              </Typography>
            </Grid>

            <Grid item xs={12} mb={-1}>
              <Typography
                sx={{
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
                color="primary"
              >
                Number of rounds
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="rounds"
                label="Rounds"
                placeholder="10000"
                autoComplete="off"
                required={true}
              />
            </Grid>

            <Grid item xs={12} mb={-1}>
              <Typography
                sx={{
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
                color="primary"
              >
                Select robots
              </Typography>
            </Grid>

            {isSelectError ? (
              <Grid item xs={12}>
                <FormHelperText error={isSelectError}>
                  {MIN_ROBOTS_ERROR}
                </FormHelperText>
              </Grid>
            ) : null}

            <Grid item xs={12} mb={-1}>
              <SelectRobot
                name="robots[0]"
                getRobotName="1"
                handleError={handleError}
              >
                Select robot 1
              </SelectRobot>
            </Grid>

            <Grid item xs={12} mb={-1}>
              <SelectRobot
                name="robots[1]"
                getRobotName="1"
                handleError={handleError}
              >
                Select robot 2
              </SelectRobot>
            </Grid>

            <Grid item xs={12} mb={-1}>
              <SelectRobot
                name="robots[2]"
                getRobotName="1"
                handleError={handleError}
              >
                Select robot 3
              </SelectRobot>
            </Grid>

            <Grid item xs={12} mb={-1}>
              <SelectRobot
                name="robots[3]"
                getRobotName="1"
                handleError={handleError}
              >
                Select robot 4
              </SelectRobot>
            </Grid>

            <Grid item xs={12}>
              <SubmitFormButton>Run simulation</SubmitFormButton>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </Card>
  );
}
