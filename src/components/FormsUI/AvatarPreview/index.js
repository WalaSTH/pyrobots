import { Avatar } from "@mui/material";
import { useField } from "formik";
import { useState } from "react";

export default function AvatarPreview({ name, alt, children, ...otherProps }) {
  const [field, meta] = useField(name);
  const file = field.value;
  const isError = !file || !meta.touched || meta.error;

  const [avatarPreview, setAvatarPreview] = useState("");
  const reader = new FileReader();
  if (!isError) {
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }
  const src = isError ? "" : avatarPreview;

  const configAvatarPreview = {
    ...field,
    src: src,
    alt: alt,
    color: "secondary",
    ...otherProps,
  };

  return <Avatar {...configAvatarPreview}> {children} </Avatar>;
}
