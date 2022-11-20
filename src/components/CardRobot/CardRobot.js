import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import DialogCode from "../../components/DialogCode/DialogCode";

export default function CardRobot({ robot }) {
  const [, name, code, played, won, avatar] = robot;
  const [showCodeDialog, setShowCodeDialog] = useState(false);

  function handleCodeDialogOpen() {
    setShowCodeDialog(true);
  }

  function handleCodeDialogClose() {
    setShowCodeDialog(false);
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
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
        <Button variant="outlined" onClick={handleCodeDialogOpen}>
          Code
        </Button>
      </CardActions>

      <DialogCode
        open={showCodeDialog}
        onClose={handleCodeDialogClose}
        name={name}
        code={code}
      />
    </Card>
  );
}
