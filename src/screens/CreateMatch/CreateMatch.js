import { Formik, Form } from "formik";
import { Grid, Container, Box, Typography, Card } from "@mui/material";
import * as Yup from "yup";
import Textfield from "../../components/FormsUI/Textfield";
import Button from "../../components/FormsUI/Button";
import Snackbar from "../../components/FormsUI/Snackbar";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { useState } from "react";

const initial_form_state = {
  matchName: "",
  password: "",
  minPlayers: "2",
  maxPlayers: "4",
  numberOfGames: "",
  numberOfRounds: "",
  creator: "1", //TODO: Get creator id from backend
  robot_id: "1", //TODO: Get robot id from backend
  robotName: "",
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
  robotName: Yup.string().required("Required"),
});

export default function CreateGame() {
  // const navigate = useNavigate(); TODO: Redirect to lobby

  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

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
          onSubmit={async (values) => {
            const params = new URLSearchParams();
            params.append("name", values.matchName);
            params.append("min_players", values.minPlayers);
            params.append("max_players", values.maxPlayers);
            params.append("gamesPerMatch", values.numberOfGames);
            params.append("rounds", values.numberOfRounds);
            params.append("robot_id", 1);
            params.append("creator", 2);
            params.append("password", values.password);

            const response = await axios.post(
              "https://634ab9a333bb42dca409da46.mockapi.io/api/matches",
              params
            );
            if (response.status === 201) {
              console.log(response.status);
              setOpen(true);
              setSeverity("success");
              setBody("Match Created!");
            } else if (response.status === 400) {
              console.log(response.status);
              setOpen(true);
              setSeverity("error");
              setBody("Selected robot doesnt belong to the user");
            } else if (response.status === 401) {
              console.log(response.status);
              setOpen(true);
              setSeverity("error");
              setBody("A match with the same name already exists");
            }
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

                <Grid item xs={12} textAlign="center">
                  <Typography>Choose your robot!</Typography>
                  <Textfield
                    name="robotName"
                    label="Robot Name"
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
        {open && (
          <Snackbar
            open={open}
            body={body}
            severity={severity}
            handleClose={handleClose}
          />
        )}
      </Box>
    </Container>
  );
}
