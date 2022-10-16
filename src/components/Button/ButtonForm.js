import { Button } from "@mui/material";
import { useFormikContext } from "formik";

export default function ButtonWrapper({ children, ...otherProps }) {
  const { submitForm } = useFormikContext();

  function handleSubmit() {
    submitForm();
  }

  const configButton = {
    variant: "contained",
    color: "primary",
    fullWidth: true,
    onClick: handleSubmit,
  };

  return <Button {...configButton}>{children}</Button>;
}
