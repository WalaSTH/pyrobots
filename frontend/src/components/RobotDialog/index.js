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
import SelectRobot from "../FormsUI/SelectRobot";
import axios from "axios";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import * as Yup from "yup";

const endpoint = "http://127.0.0.1:8000/match/join";

export default function RobotDialog({ open, handleClose, id }) {
  const navigate = useNavigate();
  const [isSelectError, setIsSelectError] = useState(false);

  const initialFormState = {
    username: localStorage.getItem("username"),
    robot_name: "",
    password: "",
    match: id,
  };

  const formValidation = Yup.object().shape({
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
      .then((response) => {
        navigate(`/lobby/${id}`);
      });
  }

  function handleError() {
    setIsSelectError(true);
  }

  const SELECT_ROBOT_ERROR = "Select your robot";

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Join match</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To join to this match, please select your robot.
        </DialogContentText>
        <Formik
          initialValues={{
            ...initialFormState,
          }}
          validationSchema={formValidation}
          onSubmit={handleSubmit}
        >
          <Form>
            <Box sx={{ marginTop: "10px" }}>
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
            </Box>
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
