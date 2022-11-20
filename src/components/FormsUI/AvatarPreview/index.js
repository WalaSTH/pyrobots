import { Avatar } from "@mui/material";
import { useField } from "formik";
import { useEffect, useState } from "react";

export default function AvatarPreview({
  name,
  alt,
  src,
  children,
  ...otherProps
}) {
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
    src: avatarPreview ? avatarPreview : src || "none",
    alt: alt,
    color: "secondary",
    children: children,
    ...otherProps,
  };

  return <Avatar {...configAvatarPreview} />;
}
