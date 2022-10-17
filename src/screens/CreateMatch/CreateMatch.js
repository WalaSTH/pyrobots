import CreateMatchForm from "../../components/FormsUI/CreateMatchForm";
import { Container, Box } from "@mui/material";
import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Snackbar from "../../components/FormsUI/Snackbar";
// import { useNavigate } from "react-router-dom";

const initialFormState = {
  name: "",
  password: "",
  min_players: "",
  max_players: "",
  games_per_match: "",
  rounds: "",
  creator: "2", //TODO: Get creator id from backend
  robot_id: "", //TODO: Get robot id from backend
};

const formValidation = Yup.object().shape({
  name: Yup.string()
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
  min_players: Yup.number()
    .integer()
    .typeError("Insert a number")
    .positive()
    .min(2)
    .max(4)
    .required("Required"),
  max_players: Yup.number()
    .integer()
    .typeError("Insert a number")
    .positive()
    .min(2)
    .max(4)
    .moreThan(Yup.ref("min_players"))
    .required("Required"),
  games_per_match: Yup.number()
    .integer()
    .typeError("Insert a number")
    .positive()
    .max(200)
    .required("Required"),
  rounds: Yup.number()
    .integer()
    .typeError("Insert a number")
    .positive()
    .max(10000)
    .required("Required"),
  robot_id: Yup.number().integer().positive().required("Required"),
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
            ...initialFormState,
          }}
          validationSchema={formValidation}
          onSubmit={async (values) => {
            await axios
              .post("http://127.0.0.1:8000/match/create", values)
              .then(function (response) {
                console.log(response.status);
                setOpen(true);
                setSeverity("success");
                setBody(response.data["detail"]);
              })
              .catch(function (error) {
                setOpen(true);
                setSeverity("error");
                setBody(error.response.data["detail"]);
                console.log(error.response.status);
              });
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
