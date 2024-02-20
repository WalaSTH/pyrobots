import { Box, Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import RobotCodeDialog from "../RobotCodeDialog";
import RobotStatsDialog from "../RobotStatsDialog";

export default function CardRobot({ robot }) {
  const [, name, code, played, won, avatar] = robot;
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);

  function handleCodeDialogOpen() {
    setShowCodeDialog(true);
  }

  function handleCodeDialogClose() {
    setShowCodeDialog(false);
  }

  function handleStatsDialogOpen() {
    setShowStatsDialog(true);
  }

  function handleStatsDialogClose() {
    setShowStatsDialog(false);
  }

  return (
    <Card>
      <CardMedia
        component="img"
        height="140rem"
        image={
          avatar ||
          "https://media.istockphoto.com/vectors/cute-white-robot-character-vector-vector-id1187576166?k=20&m=1187576166&s=612x612&w=0&h=q-REVReHr8QRzKQ_TRWGU7KTP6OBIgGh-zlg91-S-j0="
        }
        alt={name}
      />

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
      </CardContent>

      <CardActions>
        <Box display="flex" width="100%" justifyContent="space-between">
          <Button onClick={handleCodeDialogOpen}>Code</Button>
          <Button onClick={handleStatsDialogOpen}>Stats</Button>
        </Box>
      </CardActions>

      <RobotCodeDialog
        open={showCodeDialog}
        onClose={handleCodeDialogClose}
        name={name}
        code={code}
      />

      <RobotStatsDialog
        open={showStatsDialog}
        onClose={handleStatsDialogClose}
        name={name}
        stats={{ played, won }}
      />
    </Card>
  );
}
