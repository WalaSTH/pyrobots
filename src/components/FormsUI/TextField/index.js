import { TextField } from "@mui/material";
import { useField } from "formik";

export default function TextFieldWrapper({ name, ...otherProps }) {
  const [field, meta] = useField(name);

  const configTextField = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: "outlined",
    margin: "dense",
  };

  if (meta && meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }

  return <TextField {...configTextField} />;
}
