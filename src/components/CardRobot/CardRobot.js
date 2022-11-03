import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import DialogCode from "../../components/DialogCode/DialogCode";
export default function MediaCard({ robot }) {
  const [, name, code, avatar] = robot;

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={avatar ||"https://media.istockphoto.com/vectors/cute-white-robot-character-vector-vector-id1187576166?k=20&m=1187576166&s=612x612&w=0&h=q-REVReHr8QRzKQ_TRWGU7KTP6OBIgGh-zlg91-S-j0="}
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
      </CardContent>
      <CardActions>
        {/* Button code */}
        <DialogCode name={name} code={code} />
      </CardActions>
    </Card>
  );
}
