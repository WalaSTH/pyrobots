import { Avatar } from "@mui/material";
import { useState } from "react";

const PreviewImage = ({ photo }) => {
  const [preview, setPreview] = useState();
  const reader = new FileReader();
  reader.readAsDataURL(photo);
  reader.onload = () => {
    setPreview(reader.result);
  };

  return (
    <Avatar sx={{ width: "100px", height: "100px" }}>
      <img
        src={preview}
        alt="preview"
        objet-fit="cover"
        width="100%"
        height="100%"
      />
    </Avatar>
  );
};

export default PreviewImage;
