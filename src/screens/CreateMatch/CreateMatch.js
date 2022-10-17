import CreateMatchForm from "../../components/FormsUI/CreateMatchForm";
import { Container, Box } from "@mui/material";
import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Snackbar from "../../components/FormsUI/Snackbar";
// import { useNavigate } from "react-router-dom";

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
  matchName: Yup.string()
    .max(250)
    .matches(
      "^[A-Za-z0-9 ]*$",
      "Match name can only contains letters, numbers or spaces"
    )
    .required("Required"),
  password: Yup.string()
    .matches(
      "^[A-Za-z0-9 ]*$",
      "Password can only contains letters, numbers or spaces"
    )
    .max(64)
    .notRequired(),
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
  robotName: Yup.string()
    .matches(
      "^[A-Za-z0-9 ]*$",
      "Robot name can only contains letters, numbers or spaces"
    )
    .max(64)
    .required("Required"),
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
          <CreateMatchForm />
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
