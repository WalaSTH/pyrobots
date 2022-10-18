import React from "react";
import { TextField } from "@mui/material";
import { useField } from "formik";

export default function TextfieldWrapper({ name, ...otherProps }) {
  const [field, meta] = useField(name);

  const configTextfield = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: "outlined",
  };

  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }
  return <TextField {...configTextfield} />;
}
