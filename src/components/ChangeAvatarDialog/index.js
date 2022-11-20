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

export default function ChangeAvatarDialog({
  open,
  onClose,
  username,
  avatar,
}) {
  function handleSubmit() {}

  function handleCancel() {
    onClose();
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
              <Button autoFocus onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Ok</Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
