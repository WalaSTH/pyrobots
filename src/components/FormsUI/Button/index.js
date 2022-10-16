import { Button } from "@mui/material";
import { useFormikContext } from "formik";
import React from "react";

export default function ButtonWrapper({ children, ...otherProps }) {
  const { submitForm } = useFormikContext();

  function handleSubmit() {
    submitForm();
  }

  const configButton = {
    ...otherProps,
    variant: "contained",
    onClick: handleSubmit,
    fullWidth: true,
    color: "primary",
  };

  return <Button {...configButton}> {children} </Button>;
}
