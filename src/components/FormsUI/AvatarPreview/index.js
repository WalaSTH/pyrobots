import { Avatar } from "@mui/material";
import { useField } from "formik";

export default function AvatarPreview({ name, children, ...otherProps }) {
  const [field, meta] = useField(name);
  const src = meta.touched && !meta.error ? field.value : "";

  const configAvatarPreview = {
    ...field,
    ...otherProps,
    src: src,
    alt: "Avatar preview",
    color: "secondary",
  };

  return <Avatar {...configAvatarPreview}>{children}</Avatar>;
}
