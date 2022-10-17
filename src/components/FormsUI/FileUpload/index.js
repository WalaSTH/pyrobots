// import { FormControl, FormHelperText, Button } from "@mui/material";
import { Button, FormHelperText } from "@mui/material";
import { useField, useFormikContext } from "formik";
// import { Fragment, useEffect } from "react";

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
    const reader = new FileReader();
    const targetFile = e.target.files[0];

    if (targetFile) {
      reader.onloadend = () => {
        setFieldValue(`${name}.data`, reader.result);
      };
      reader.readAsDataURL(targetFile);
      setFieldValue(`${name}.file`, targetFile);
    }
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
      <Button htmlFor={name} {...configButton}>
        {children}
      </Button>
      {isError ? (
        <FormHelperText error={true} sx={{ textAlign: "center" }}>
          {meta.error.file}
        </FormHelperText>
      ) : null}
    </>
  );
}
