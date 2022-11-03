import CreateMatchForm from "../../components/FormsUI/CreateMatchForm";
import Container from "@mui/material/Container";
import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Snackbar from "../../components/FormsUI/Snackbar";

export default function CreateMatch({ userID }) {
  return (
    <Container component="main" maxWidth="xs">
      <CreateMatchForm UserID={userID} />
    </Container>
  );
}
