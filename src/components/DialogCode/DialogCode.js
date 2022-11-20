import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export default function DialogCode({ open, onClose, name, code }) {
  return (
    <Box>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color="primary">
          {name}
        </DialogTitle>

        <DialogContent>
          <TextField
            value={code}
            label={name}
            margin="dense"
            variant="filled"
            disabled={true}
            multiline={true}
            maxRows={10}
            fullWidth={true}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
