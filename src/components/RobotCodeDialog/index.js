import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

export default function RobotCodeDialog({ open, onClose, name, code }) {
  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle color="primary">{name}</DialogTitle>

      <DialogContent>
        <TextField
          value={code}
          label={name}
          margin="dense"
          variant="filled"
          disabled={true}
          multiline={true}
          maxRows={10}
          fullWidth
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
