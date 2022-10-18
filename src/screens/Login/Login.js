import LoginForm from "../../components/LoginForm/LoginForm";
import Snackbar from "../../components/FormsUI/Snackbar";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { useState } from "react";
import "./LoginStyle.css";
import axios from "axios";

export default function Login({ handleLogin }) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  // function handleResponse(res) {
  //   if (res.status === 422) {
  //     console.log("Bad request");
  //     return;
  //   }
  //   if (res.status === 200) {
  //     console.log("All good");
  //     handleLogin(res.data);
  //     return;
  //   }
  //   if (res.status === 406) {
  //     alert("Password do not match");
  //     return;
  //   }
  //   if (res.status === 402) {
  //     alert("Fallo en la seguridad");
  //     return;
  //   }
  // }

  async function loginUser(credentials) {
    const params = new URLSearchParams();
    params.append("username", credentials.e.username);
    params.append("password", credentials.e.password);
    // const obj = {
    //   username: credentials.e.username,
    //   password: credentials.e.password,
    // };
    // const json_object = JSON.stringify(obj);
    // console.log(json_object);
    return axios
      .post("http://127.0.0.1:8000/token", params)
      .then((res) => {
        console.log(res);
        const status = res.status;
        const data = res.data;
        if (status === 200) {
          console.log("All good");
          handleLogin(data);
          return;
        }
      })
      .catch((error) => {
        console.log(error);
        if (error === 422) {
          setBody("Bad request");
          return;
        }
        if (error === 406) {
          setBody("Password do not match");
          return;
        }
        if (error === 402) {
          setBody("Security failure");
          return;
        }
        setOpen(true);
        setSeverity("error");
        console.log(error);
      });
  }

  const handleSubmit = async (e) => {
    const fetchedData = await loginUser({
      e,
    });
    //handleResponse(fetchedData);
  };
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#efefef",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LoginForm handleSubmit={handleSubmit} />
      {open && (
        <Snackbar
          open={open}
          body={body}
          severity={severity}
          handleClose={handleClose}
        />
      )}
    </Box>
  );
}

Login.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};
