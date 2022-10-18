import React from "react";
import { Button } from "@mui/material";
import { useFormikContext } from "formik";

export default function ButtonWrapper({ children, ...otherProps }) {
  const { submitForm } = useFormikContext();
  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm();
  };

  const configButton = {
    variant: "contained",
    color: "primary",
    fullWidth: true,
    type: "submit",
    onClick: handleSubmit,
    ...otherProps,
  };

  return <Button {...configButton}>{children}</Button>;
}
