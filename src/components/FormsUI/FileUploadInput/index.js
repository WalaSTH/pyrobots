import { useFormikContext } from "formik";

export default function FileUploadInput({ name, ...otherProps }) {
  const { setFieldValue } = useFormikContext();

  function handleChange(e) {
    setFieldValue(name, e.target.files[0]);
  }

  const configInput = {
    id: name,
    type: "file",
    hidden: true,
    onChange: handleChange,
    ...otherProps,
  };

  return <input {...configInput} />;
}
