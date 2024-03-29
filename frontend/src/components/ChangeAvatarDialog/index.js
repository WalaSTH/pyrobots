import * as Yup from "yup";
import { Form, Formik } from "formik";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  avatar: "",
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
  snackbarProps,
}) {
  const { setOpen, setBody, setSeverity } = snackbarProps;

  async function handleSubmit(values) {
    return await axios
      .put("http://127.0.0.1:8000/user/update", {
        username: username,
        param: "avatar",
        new_pic: values.avatar ? await toBase64(values.avatar) : "",
      })
      .then(function (response) {
        onClose();
        setOpen(true);
        setSeverity("success");
        setBody(response.data.detail);
        localStorage.setItem("avatar", response.data.new_avatar);
        setAvatar(response.data.new_avatar);
      })
      .catch(function (error) {
        onClose();
        setSeverity("error");
        if (
          error.response &&
          typeof error.response.data["detail"] != "object"
        ) {
          setBody(error.response.data["detail"]);
        } else {
          setBody("Unknown error");
        }
        setOpen(true);
      });
  }

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Formik
        initialValues={{ ...initialFormState }}
        validationSchema={formValidation}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {(formProps) => (
          <Form>
            <DialogTitle color="primary">Change avatar</DialogTitle>

            <DialogContent>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                }}
              >
                <AvatarPreview
                  data-testid="avatarDisplay"
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
                      buttonProps={{
                        startIcon: <AddAPhotoIcon />,
                        "data-testid": "avatarInputButton",
                      }}
                    >
                      Select an image
                    </FileUploadButton>
                  </ListItem>

                  <ListItem>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        formProps.setFieldValue("avatar", "");
                        if (avatar) {
                          formProps.setFieldTouched("avatar", true);
                        } else {
                          formProps.setFieldTouched("avatar", false);
                        }
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

                <Button type="submit" disabled={!formProps.touched.avatar}>
                  Update
                </Button>
              </Box>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
