import { FormControl, FormHelperText, Button } from "@mui/material";
import { useField, useFormikContext } from "formik";
import React from "react";

export default function FileUpload({ name, title, options, ...otherProps }) {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  function handleChange(event) {
    setFieldValue(name, event.target.files[0]);
  }

  const configInput = {
    ...otherProps,
    onChange: handleChange,
    hidden: true,
  };

  const configButton = {
    variant: "outlined",
    fullWidth: true,
  };

  return (
    <FormControl fullWidth={true}>
      <input id={name} name={name} type="file" {...configInput} />
      <Button
        component="label"
        htmlFor={name}
        {...configButton}
        color={meta.touched && meta.error ? "error" : "primary"}
      >
        {title}
      </Button>
      {meta.touched && meta.error ? (
        <FormHelperText error={true}>{meta.error}</FormHelperText>
      ) : null}
    </FormControl>
  );
}
