import { Button } from "@mui/material";

export default function ButtonWrapper({ children, ...otherProps }) {
  const configButton = {
    variant: "contained",
    color: "primary",
    size: "large",
    fullWidth: true,
    type: "submit",
    ...otherProps,
  };

  return <Button {...configButton}>{children}</Button>;
}
