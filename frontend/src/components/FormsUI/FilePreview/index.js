import { TextField } from "@mui/material";
import { useField } from "formik";
import { useEffect, useState } from "react";

export default function FilePreview({ name, ...otherProps }) {
  const [field, meta] = useField(name);
  const file = field.value;
  const isError = !meta.touched || meta.error;

  const [fileData, setFileData] = useState("");

  useEffect(() => {
    if (file && !isError) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileData(reader.result);
      };
      reader.readAsBinaryString(file);
    }
  }, [isError, file]);

  const configFilePreview = {
    ...field,
    label: !isError && file && file.name,
    value: fileData,
    margin: "dense",
    variant: "filled",
    disabled: true,
    multiline: true,
    maxRows: 5,
    fullWidth: true,
    color: "secondary",
    ...otherProps,
  };

  return <>{file && !isError && <TextField {...configFilePreview} />}</>;
}
