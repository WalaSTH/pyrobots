import { Button, FormHelperText, Input } from "@mui/material";
import { useField, useFormikContext } from "formik";

export default function FileUploadButton({
  id,
  name,
  buttonProps,
  children,
  ...otherProps
}) {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [, meta] = useField(name);
  const isError = meta.touched && meta.error;

  function handleChange(e) {
    setFieldValue(name, e.target.files[0]);
    setFieldTouched(name, true);
    e.target.value = "";
  }

  const configInput = {
    id: id,
    type: "file",
    hidden: true,
    onChange: handleChange,
    sx: { display: "none" },
    ...otherProps,
  };

  const configButton = {
    component: "label",
    htmlFor: id,
    fullWidth: true,
    variant: "outlined",
    color: isError ? "error" : "primary",
    children: children,
    ...buttonProps,
  };

  return (
    <>
      <Input {...configInput} />
      <Button {...configButton} />
      {isError && <FormHelperText error={true}> {meta.error} </FormHelperText>}
    </>
  );
}
