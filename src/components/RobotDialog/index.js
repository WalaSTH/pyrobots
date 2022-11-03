import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import TextField from "../FormsUI/TextField";
import axios from "axios";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";

const endpoint = "http://127.0.0.1:8000/match/join";

export default function PasswordDialog({ open, handleClose, id }) {
  const initialFormState = {
    username: localStorage.getItem("username"),
    robot_name: "",
    password: "",
    match: id,
  };
  const navigate = useNavigate();

  async function handleSubmit(values) {
    await axios
      .post(endpoint, {
        username: values.username,
        robot: values.robot_name,
        password: values.password,
        match: values.match,
      })
      .then((response) => {
        const data = response.data;
        console.log(data);
        navigate(`/lobby/${id}`);
      });
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Join match</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To join to this match, please enter the lobby password.
        </DialogContentText>
        <Formik
          initialValues={{
            ...initialFormState,
          }}
          onSubmit={handleSubmit}
        >
          <Form>
            <TextField
              name="robot_name"
              label="Robot Name"
              autoComplete="off"
              fullWidth
              variant="standard"
            />

            <DialogActions>
              <Box display="flex" width="100%" justifyContent="space-between">
                <Button onClick={handleClose} color="error">
                  Cancel
                </Button>
                <Button onClick={handleClose} type="submit">
                  Join
                </Button>
              </Box>
            </DialogActions>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
