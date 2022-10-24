import { Card, Grid, Typography, Box } from "@mui/material";
import Textfield from "../Textfield";
import SubmitFormButton from "../SubmitFormButton";

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
                <Typography sx={{ fontSize: 18, fontWeight: 500 }}>
                  Create Match
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Textfield
                  name="name"
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
                  name="min_players"
                  label="Min players"
                  placeholder="2"
                  autoComplete="off"
                />
              </Grid>

              <Grid item xs={6} textAlign="center">
                <Textfield
                  name="max_players"
                  label="Max players"
                  placeholder="4"
                  autoComplete="off"
                />
              </Grid>

              <Grid item xs={6}>
                <Textfield
                  name="games_per_match"
                  label="Games"
                  placeholder="200"
                  autoComplete="off"
                />
              </Grid>

              <Grid item xs={6}>
                <Textfield
                  name="rounds"
                  label="Rounds"
                  placeholder="10000"
                  autoComplete="off"
                />
              </Grid>

              <Grid item xs={12} textAlign="center">
                <Typography>Choose your robot!</Typography>
                <Textfield
                  name="robot_id"
                  label="Robot ID"
                  autoComplete="off"
                />
              </Grid>

            <Grid item xs={12}>
              <SubmitFormButton>Create match</SubmitFormButton>
            </Grid>
          </Grid>
        </Card>
      </Form>
    </>
  );
}
