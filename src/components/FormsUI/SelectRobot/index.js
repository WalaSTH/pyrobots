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
import getRobots from "../../api/getRobots";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({
  handleChoice,
  children,
  ...otherProps
}) {
  const [open, setOpen] = useState(false);
  const [dataRobot, setDataRobot] = useState([]);

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
      <Button variant="outlined" onClick={handleOpen} {...otherProps}>
        {children ? children : "Select Robot"}
      </Button>

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
                    handleChoice(robot[1]);
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
