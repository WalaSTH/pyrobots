// import { FormControl, FormHelperText, Button } from "@mui/material";
import { Button, FormHelperText } from "@mui/material";
import { useField, useFormikContext } from "formik";

export default function FileUpload({
  name,
  buttonProps,
  children,
  ...otherProps
}) {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);
  const isError = meta.touched && meta.error;

  function handleChange(e) {
    setFieldValue(name, e.target.files[0]);
  }

  const configInput = {
    ...otherProps,
    id: name,
    type: "file",
    hidden: true,
    onChange: handleChange,
  };

  const configButton = {
    ...buttonProps,
    variant: "outlined",
    component: "label",
    htmlFor: name,
    fullWidth: true,
    color: isError ? "error" : "primary",
  };

  return (
    <>
      <input {...configInput} />
      <Button {...configButton}>{children}</Button>
      {isError ? (
        <FormHelperText error={true}>{meta.error}</FormHelperText>
      ) : null}
    </>
  );
}
