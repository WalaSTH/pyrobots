// Select Robot --> component
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { useEffect, useState } from "react";
import getRobots from "../../api/getRobots";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
  const [open, setOpen] = React.useState(false);
  // 'Choice' its the selected robot
  const [choice, setChoice] = React.useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [dataRobot, setdataRobot] = useState([]);

  useEffect(() => {
    console.log("Fetching data");
    getRobots().then((response) => setdataRobot(response));
  }, []);

  console.log(choice);
  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Select Robot
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
              Robot List
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          {dataRobot.map((robot, i) => (
            <ListItem button onClick={() => setChoice(dataRobot[i])}>
              <ListItemText
                primary={robot[1]}
                secondary={`ID Robot: ${robot[0]}`}
              />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </div>
  );
}
