import { Formik, Form } from "formik";
import { Grid, Container, Box, Typography, Card } from "@mui/material";
import * as Yup from "yup";
import Textfield from "../../components/FormsUI/Textfield";
import Button from "../../components/FormsUI/Button";

const initial_form_state = {
  matchName: "",
  password: "",
  minPlayers: "2",
  maxPlayers: "4",
  numberOfGames: "",
  numberOfRounds: "",
};

const form_validation = Yup.object().shape({
  matchName: Yup.string().max(64).required("Required"),
  password: Yup.string().notRequired(),
  minPlayers: Yup.number()
    .integer()
    .typeError("Insert a number")
    .positive()
    .min(2)
    .max(4)
    .required("Required"),
  maxPlayers: Yup.number()
    .integer()
    .typeError("Insert a number")
    .positive()
    .min(2)
    .max(4)
    .moreThan(Yup.ref("minPlayers"))
    .required("Required"),
  numberOfGames: Yup.number()
    .integer()
    .typeError("Insert a number")
    .positive()
    .max(200)
    .required("Required"),
  numberOfRounds: Yup.number()
    .integer()
    .typeError("Insert a number")
    .positive()
    .max(10000)
    .required("Required"),
});

export default function CreateGame() {
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
          initialValues={{
            ...initial_form_state,
          }}
          validationSchema={form_validation}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          <Form>
            <Card
              variant="outlined"
              sx={{ marginTop: 3, padding: 3, borderRadius: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Typography sx={{ fontSize: 18, fontWeight: 500 }}>
                    Create Match
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Textfield
                    name="matchName"
                    label="Name of the match"
                    autoComplete="off"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Textfield
                    name="password"
                    label="Password (Optional)"
                    type="password"
                    autoComplete="off"
                  />
                </Grid>

                <Grid item xs={6} textAlign="center">
                  <Textfield
                    name="minPlayers"
                    label="Min players"
                    autoComplete="off"
                  />
                </Grid>

                <Grid item xs={6} textAlign="center">
                  <Textfield
                    name="maxPlayers"
                    label="Max players"
                    autoComplete="off"
                  />
                </Grid>

                <Grid item xs={6}>
                  <Textfield
                    name="numberOfGames"
                    label="Games"
                    placeholder="200"
                    autoComplete="off"
                  />
                </Grid>

                <Grid item xs={6}>
                  <Textfield
                    name="numberOfRounds"
                    label="Rounds"
                    placeholder="10000"
                    autoComplete="off"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button>Create match</Button>
                </Grid>
              </Grid>
            </Card>
          </Form>
        </Formik>
      </Box>
    </Container>
  );
}
