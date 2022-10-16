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
    fullWidth: true,
    color: "primary",
    variant: "outlined",
  };

  return (
    <FormControl>
      <input id={name} name={name} type="file" {...configInput} />
      <Button component="label" htmlFor={name} {...configButton}>
        {title}
      </Button>
      {field.value ? <FormHelperText>{field.value.name}</FormHelperText> : null}
      {meta.touched && meta.error ? (
        <FormHelperText error={true}>{meta.error}</FormHelperText>
      ) : null}
    </FormControl>
  );
}
