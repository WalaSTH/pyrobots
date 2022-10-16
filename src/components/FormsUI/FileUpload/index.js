import { Label } from "@mui/icons-material";
import { Input, Container } from "@mui/material";
import { ErrorMessage, useField, useFormikContext } from "formik";
import React from "react";

export default function FileUpload({ name, fileRef, options, ...otherProps }) {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  function handleChange(event) {
    const { value } = event.target;
    setFieldValue(name, value);
  }

  const configInput = {
    ...field,
    ...otherProps,
    fullWidth: true,
    onChange: handleChange,
  };

  return (
    <Container>
      {/* <Label htmlFor={name}>Choose file</Label> */}
      <Input type="file" {...configInput} />
      {meta.touched && meta.error ? (
        <div style={{ color: "red" }}>{meta.error}</div>
      ) : null}
    </Container>
  );
}
