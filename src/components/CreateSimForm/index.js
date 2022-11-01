// Form input and validation
import * as Yup from "yup";
import { Form, Formik } from "formik";

// Custom components for form input with formik and MUI
import TextField from "../FormsUI/TextField";
import SubmitFormButton from "../FormsUI/SubmitFormButton";

// MUI components
import { Card, Grid, Typography } from "@mui/material";
import SelectRobot from "../FormsUI/Select";

const initialFormState = {
  rounds: "",
  robotNames: ["", "", "", ""],
};

// const count = arr.reduce((accumulator, value) => {
//   return accumulator + (value !== "" ? 1 : 0);
// }, 0);

function countRobots(arr) {
  var accumulator = 0;
  arr.forEach((element) => {
    accumulator = accumulator + (element ? 1 : 0);
  });
  console.log(accumulator);
  return accumulator;
}

const formValidation = Yup.object().shape({
  rounds: Yup.number()
    .integer()
    .typeError("Must be a valid number")
    .positive("Must be a positive number")
    .max(10000, "Max number of rounds is 10000")
    .required("Required"),
  robotNames: Yup.array()
    .of(Yup.string().required())
    .test(
      "minRobots",
      "Select more than one robot",
      (value) => countRobots(value) > 1
    ),
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
                  fontSize: { xs: "1.25rem", md: "1.50rem" },
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
                gridGap: "13px",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
                color="primary"
              >
                Number of rounds
              </Typography>

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
                gridGap: "13px",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
                color="primary"
              >
                Select robots
              </Typography>
              <SelectRobot name={"robotNames[0]"} />
              <SelectRobot name={"robotNames[1]"} />
              <SelectRobot name={"robotNames[2]"} />
              <SelectRobot name={"robotNames[3]"} />
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
