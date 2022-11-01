import {
  Button,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function PasswordDialog({ open, handleClose }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Join match</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To join to this match, please enter the lobby password.
        </DialogContentText>
        <form>
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="password"
            autoComplete="off"
            fullWidth
            variant="standard"
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Box display="flex" width="100%" justifyContent="space-between">
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleClose}>Join</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
