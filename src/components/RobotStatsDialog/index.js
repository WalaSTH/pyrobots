import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PercentIcon from "@mui/icons-material/Percent";

export default function RobotStatsDialog({ open, onClose, name, stats }) {
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle color="primary">{name + "'s stats"}</DialogTitle>

      <DialogContent>
        <Card
          variant="filled"
          sx={{
            backgroundColor: "#f0f7ff",
          }}
        >
          <List>
            <ListItem>
              <ListItemAvatar>
                <SportsEsportsIcon />
              </ListItemAvatar>
              <ListItemText primary="Matches played" secondary={stats.played} />
            </ListItem>

            <ListItem>
              <ListItemAvatar>
                <EmojiEventsIcon />
              </ListItemAvatar>
              <ListItemText primary="Matches won" secondary={stats.won} />
            </ListItem>

            <ListItem>
              <ListItemAvatar>
                <PercentIcon />
              </ListItemAvatar>
              <ListItemText
                primary="Victory rate"
                secondary={
                  stats.played === 0 ? "0%" : stats.won / stats.played + "%"
                }
              />
            </ListItem>
          </List>
        </Card>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
