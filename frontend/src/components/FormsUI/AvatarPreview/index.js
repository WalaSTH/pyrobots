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
  const isError = !meta.touched || meta.error;

  const [avatarPreview, setAvatarPreview] = useState("none");

  useEffect(() => {
    if (file && !isError) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview("");
    }
  }, [file, isError]);

  const configAvatarPreview = {
    ...field,
    src: (!isError ? avatarPreview : src) || "none",
    alt: alt,
    color: "secondary",
    children: children,
    ...otherProps,
  };

  return <Avatar {...configAvatarPreview} />;
}
