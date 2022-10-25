import { Button, FormHelperText } from "@mui/material";
import { useField } from "formik";

export default function FileUploadButton({ name, children, ...otherProps }) {
  const [, meta] = useField(name);
  const isError = meta.touched && meta.error;

  const configButton = {
    component: "label",
    htmlFor: name,
    fullWidth: true,
    variant: "outlined",
    color: isError ? "error" : "primary",
    ...otherProps,
  };

  return (
    <>
      <Button {...configButton}> {children} </Button>
      {isError ? (
        <FormHelperText error={true}> {meta.error} </FormHelperText>
      ) : null}
    </>
  );
}
