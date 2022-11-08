import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Card,
  Typography,
  Divider,
} from "@mui/material";

export default function RobotDialog({ open, handleClose, params }) {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <Typography component="h1" variant="h5" textAlign="center" pt="10px">
        Result of {params.row.name}
      </Typography>
      <DialogContent>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            paddingLeft: 2,
            paddingRight: 2,
            paddingBottom: 2,
          }}
        >
          <Typography
            variant="h6"
            color="primary"
            padding={1}
            textAlign="center"
          >
            Participants
          </Typography>
          <Card
            variant="filled"
            sx={{
              backgroundColor: "#f0f7ff",
              padding: 1,
            }}
          >
            Robot 1
            <Divider />
            Robot 2
            <Divider />
            Robot 3
            <Divider />
            Robot 4
          </Card>
        </Card>
        <DialogActions>
          <Box display="flex" width="100%" justifyContent="space-between">
            <Button onClick={handleClose} color="error">
              Back
            </Button>
          </Box>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
