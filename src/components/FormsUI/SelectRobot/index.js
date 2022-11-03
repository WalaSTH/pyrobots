import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { forwardRef, useEffect, useState } from "react";
import {
  AppBar,
  Button,
  Dialog,
  List,
  ListItem,
  ListItemText,
  Slide,
  Toolbar,
} from "@mui/material";
import getRobots from "../../../api/getRobots";
import { useField, useFormikContext } from "formik";
import { Box } from "@mui/system";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SelectRobot({ name, children, handleError }) {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);
  const [open, setOpen] = useState(false);
  const [dataRobot, setDataRobot] = useState([]);
  const isError = meta.touched && meta.error;

  useEffect(() => {
    if (isError) {
      handleError();
    }
  }, [isError]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    console.log("Fetching data");
    getRobots().then((e) => setDataRobot(e));
  }, []);

  return (
    <div>
      <Box sx={{ display: "flex" }}>
        {field.value ? (
          <IconButton
            color="error"
            onClick={() => {
              setFieldValue(name, "");
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}

        <Button
          variant={field.value ? "contained" : "outlined"}
          onClick={handleOpen}
          fullWidth
          disabled={field.value !== ""}
          color={isError ? "error" : "primary"}
        >
          {children ? field.value || children : field.value || "Select Robot"}
        </Button>
      </Box>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>

            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Select Robot
            </Typography>
          </Toolbar>
        </AppBar>

        <List>
          {dataRobot
            ? dataRobot.map((robot, i) => (
                <ListItem
                  button
                  key={robot[1]}
                  onClick={() => {
                    setFieldValue(name, robot[1]);
                    handleClose();
                  }}
                >
                  <ListItemText primary={robot[1]} />
                </ListItem>
              ))
            : null}
        </List>
      </Dialog>
    </div>
  );
}
