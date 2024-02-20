import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
} from "@mui/material";
import TextField from "../FormsUI/TextField";
import SelectRobot from "../FormsUI/SelectRobot";
import axios from "axios";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import * as Yup from "yup";

const endpoint = "http://127.0.0.1:8000/match/join";

export default function PasswordDialog({ open, handleClose, id }) {
  const [isSelectError, setIsSelectError] = useState(false);
  const [error, setError] = useState(false);
  const [body, setBody] = useState(false);

  const initialFormState = {
    username: localStorage.getItem("username"),
    robot_name: "",
    password: "",
    match: id,
  };
  const navigate = useNavigate();

  const formValidation = Yup.object().shape({
    password: Yup.string()
      .matches(
        "^[A-Za-z0-9 ]*$",
        "Password can only contains letters, numbers or spaces"
      )
      .max(64, "Password cant contain more than 64 characters")
      .required(),
    robot_name: Yup.string().required(),
  });

  async function handleSubmit(values) {
    await axios
      .post(endpoint, {
        username: values.username,
        robot: values.robot_name,
        password: values.password,
        match: values.match,
      })
      .then(() => {
        navigate(`/lobby/${id}`);
      })
      .catch((error) => {
        if (error.response) {
          setBody(error.response.data["detail"]);
        } else {
          setBody("Unknown error");
        }
        setError(true);
      });
  }

  function handleError() {
    setIsSelectError(true);
  }

  function handleChange() {
    return error ? setError(false) : "";
  }

  const SELECT_ROBOT_ERROR = "Select your robot";

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Join match</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To join to this match, please enter the lobby password and select a
          robot.
        </DialogContentText>
        <Formik
          initialValues={{
            ...initialFormState,
          }}
          validationSchema={formValidation}
          onSubmit={handleSubmit}
        >
          <Form>
            {error ? (
              <FormHelperText error={error}>{body}</FormHelperText>
            ) : null}
            <TextField
              name="password"
              label="Password"
              type="password"
              autoComplete="off"
              variant="standard"
              onClick={handleChange}
              sx={{ marginBottom: "10px" }}
            />
            {isSelectError ? (
              <FormHelperText error={isSelectError}>
                {SELECT_ROBOT_ERROR}
              </FormHelperText>
            ) : null}
            <SelectRobot
              name="robot_name"
              handleError={handleError}
              getRobotName="1"
            />

            <DialogActions>
              <Box display="flex" width="100%" justifyContent="space-between">
                <Button onClick={handleClose} color="error">
                  Cancel
                </Button>
                <Button type="submit">Join</Button>
              </Box>
            </DialogActions>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
