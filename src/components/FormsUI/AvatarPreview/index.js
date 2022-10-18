import { Avatar } from "@mui/material";
import { useField } from "formik";
import { useState } from "react";

export default function AvatarPreview({ name, children, ...otherProps }) {
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

  const configAvatarPreview = {
    ...field,
    ...otherProps,
    src: avatarPreview,
    alt: "Avatar preview",
    color: "secondary",
  };

  return <Avatar {...configAvatarPreview}>{children}</Avatar>;
}
