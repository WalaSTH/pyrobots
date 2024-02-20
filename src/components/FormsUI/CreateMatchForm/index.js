import { Card, Grid, Typography, Box } from "@mui/material";
import TextField from "../TextField";
import SubmitFormButton from "../SubmitFormButton";
import SelectRobot from "../SelectRobot";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const formValidation = Yup.object().shape({
  name: Yup.string()
    .min(3, "Match name must have more than 3 characters")
    .max(20, "Match name cant contain more than 20 characters")
    .matches(
      "^[A-Za-z0-9 ]*$",
      "Match name can only contains letters, numbers or spaces"
    ),
  password: Yup.string()
    .matches(
      "^[A-Za-z0-9 ]*$",
      "Password can only contains letters, numbers or spaces"
    )
    .max(64, "Password cant contain more than 64 characters")
    .notRequired(),
  min_players: Yup.number()
    .integer()
    .typeError("Insert a number")
    .positive()
    .min(2, "Min players must be greater or equal than 2")
    .max(4, "Min players must be lower or equal than 4"),
  max_players: Yup.number()
    .integer()
    .typeError("Insert a number")
    .positive()
    .min(
      Yup.ref("min_players"),
      "Max players must be greater or equal than Min players"
    )
    .max(4),
  games_per_match: Yup.number()
    .integer()
    .typeError("Insert a number")
    .positive()
    .max(200),
  rounds: Yup.number()
    .integer()
    .typeError("Insert a number")
    .positive()
    .max(10000),
  robot_id: Yup.number().integer().positive().required(),
});

export default function CreateMatchForm({ userID, handleSubmit }) {
  const initialFormState = {
    name: "",
    password: "",
    min_players: "",
    max_players: "",
    games_per_match: "",
    rounds: "",
    robot_id: "",
    creator: userID,
  };

  return (
    <Box
      sx={{
        marginTop: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Formik
        initialValues={{
          ...initialFormState,
        }}
        validationSchema={formValidation}
        onSubmit={handleSubmit}
      >
        <Form>
          <Card
            variant="outlined"
            sx={{ marginTop: 3, padding: 3, borderRadius: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Typography component="h1" variant="h5">
                  Create Match
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Name of the match"
                  autoComplete="off"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="password"
                  label="Password (Optional)"
                  type="password"
                  data-testid="passwordInput"
                  autoComplete="off"
                />
              </Grid>

              <Grid item xs={6} textAlign="center">
                <TextField
                  name="min_players"
                  label="Min players"
                  placeholder="2"
                  autoComplete="off"
                  required
                />
              </Grid>

              <Grid item xs={6} textAlign="center">
                <TextField
                  name="max_players"
                  label="Max players"
                  placeholder="4"
                  autoComplete="off"
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="games_per_match"
                  label="Games"
                  placeholder="200"
                  autoComplete="off"
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="rounds"
                  label="Rounds"
                  placeholder="10000"
                  autoComplete="off"
                  required
                />
              </Grid>

              <Grid item xs={12} textAlign="center">
                <SelectRobot name="robot_id" getRobotName="0" />
              </Grid>

              <Grid item xs={12}>
                <SubmitFormButton data-testid="createMatchButton">
                  Create match
                </SubmitFormButton>
              </Grid>
            </Grid>
          </Card>
        </Form>
      </Formik>
    </Box>
  );
}
