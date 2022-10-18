import { TextField } from "@mui/material";
import { useField } from "formik";
import { useState } from "react";

export default function FilePreview({ name, ...otherProps }) {
  const [field, meta] = useField(name);
  const file = field.value;
  const isError = !file || !meta.touched || meta.error;
  const label = isError ? "" : file.name;

  const [fileData, setFileData] = useState("");
  const reader = new FileReader();
  if (!isError) {
    reader.onloadend = () => {
      setFileData(reader.result);
    };
    reader.readAsBinaryString(file);
  }

  const configFilePreview = {
    ...field,
    ...otherProps,
    label: label,
    value: fileData,
    margin: "dense",
    variant: "filled",
    disabled: true,
    multiline: true,
    maxRows: 5,
    fullWidth: true,
    color: "secondary",
  };

  return <>{isError ? null : <TextField {...configFilePreview} />}</>;
}
