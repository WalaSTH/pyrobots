import { Form } from "formik";
import { Card, Grid, Typography } from "@mui/material";
import Textfield from "../Textfield";
import Button from "../Button";

export default function CreateMatchForm() {
  return (
    <>
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
      ;
    </>
  );
}
