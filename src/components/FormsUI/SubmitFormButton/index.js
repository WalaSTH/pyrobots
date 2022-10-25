import { Button } from "@mui/material";
import { useFormikContext } from "formik";

export default function ButtonWrapper({ children, ...otherProps }) {
  const { submitForm } = useFormikContext();

  const configButton = {
    variant: "contained",
    color: "primary",
    size: "large",
    fullWidth: true,
    onClick: submitForm,
    type: "submit",
    ...otherProps,
  };

  return <Button {...configButton}>{children}</Button>;
}
