import { useState } from "react";
import { Avatar } from "@mui/material";
const PreviewImage = ({ file }) => {
  const [preview, setPreview] = useState();
  const reader = new FileReader();
  reader.readAsDataURL(file);
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
      ;
    </Avatar>
  );
};

export default PreviewImage;
