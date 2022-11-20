// Form handling and validation
import * as Yup from "yup";
import { Form, Formik } from "formik";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  ListItem,
} from "@mui/material";
import AvatarPreview from "../FormsUI/AvatarPreview";
import FileUploadButton from "../FormsUI/FileUploadButton";
import {
  AddAPhoto as AddAPhotoIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";

const initialFormState = {
  avatar: null,
};

const formValidation = Yup.object().shape({
  avatar: Yup.mixed()
    .notRequired()
    .test(
      "avatarFileFormat",
      "Unsupported file format",
      (value) =>
        !value ||
        (value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
    ),
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default function ChangeAvatarDialog({
  open,
  onClose,
  username,
  avatar,
  setAvatar,
}) {
  async function handleSubmit(values) {
    onClose();
    return await axios
      .put("http://127.0.0.1:8000/user/update", {
        username: username,
        param: "avatar",
        new_pic: await toBase64(values.avatar),
      })
      .then(function (response) {
        localStorage.setItem("avatar", response.data.new_avatar);
        setAvatar(response.data.new_avatar);
      })
      .catch(function (error) {
        console.log(error.response);
      });
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <Formik
        initialValues={{ ...initialFormState }}
        validationSchema={formValidation}
        initialTouched={{
          avatar: true,
        }}
        onSubmit={handleSubmit}
      >
        {(formProps) => (
          <Form>
            <DialogTitle> Edit user avatar</DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                }}
              >
                <AvatarPreview
                  name="avatar"
                  alt={username}
                  src={avatar}
                  sx={{
                    width: "10rem",
                    height: "10rem",
                    fontSize: "4rem",
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <ListItem>
                    <FileUploadButton
                      name="avatar"
                      id="userAvatarInput"
                      inputProps={{ accept: "image/png,image/jpg,image/jpeg" }}
                      buttonProps={{ startIcon: <AddAPhotoIcon /> }}
                    >
                      Select avatar
                    </FileUploadButton>
                  </ListItem>
                  <ListItem>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        formProps.resetForm();
                      }}
                      color="error"
                    >
                      Delete
                    </Button>
                  </ListItem>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Box display="flex" width="100%" justifyContent="space-between">
                <Button
                  autoFocus
                  color="error"
                  onClick={() => {
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </Box>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
