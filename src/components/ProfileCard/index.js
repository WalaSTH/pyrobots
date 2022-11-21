// MUI components
import {
  Avatar,
  Card,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
} from "@mui/material";

// MUI icons
import SettingsIcon from "@mui/icons-material/Settings";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PercentIcon from "@mui/icons-material/Percent";
import { useState } from "react";

function StatsCard({ stats }) {
  return (
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
          <ListItemText
            primary="Matches played"
            secondary={
              stats ? (
                stats.played_matches
              ) : (
                <Skeleton width="40%" data-testid="statsSkeleton" />
              )
            }
            secondaryTypographyProps={stats && { "data-testid": "statsItem" }}
          />
        </ListItem>

        <ListItem>
          <ListItemAvatar>
            <EmojiEventsIcon />
          </ListItemAvatar>
          <ListItemText
            primary="Matches won"
            secondary={
              stats ? (
                stats.victories
              ) : (
                <Skeleton width="40%" data-testid="statsSkeleton" />
              )
            }
            secondaryTypographyProps={stats && { "data-testid": "statsItem" }}
          />
        </ListItem>

        <ListItem>
          <ListItemAvatar>
            <PercentIcon />
          </ListItemAvatar>
          <ListItemText
            primary="Victory rate"
            secondary={
              stats ? (
                stats.played_matches === 0 ? (
                  "0%"
                ) : (
                  stats.victories / stats.played_matches + "%"
                )
              ) : (
                <Skeleton width="40%" data-testid="statsSkeleton" />
              )
            }
            secondaryTypographyProps={stats && { "data-testid": "statsItem" }}
          />
        </ListItem>
      </List>
    </Card>
  );
}

export default function ProfileCard({ username, avatar, stats }) {
  const [anchorEl, setAnchorEl] = useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const menuOpen = Boolean(anchorEl);

  return (
    <Card
      variant="outlined"
      sx={{
        padding: 3,
        borderRadius: 3,
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "right",
            marginBottom: -1.5,
          }}
        >
          <IconButton
            data-testid="userSettingsButton"
            onClick={handleClick}
            sx={{
              marginBottom: -4,
            }}
          >
            <SettingsIcon />
          </IconButton>

          <Menu
            data-testid="userSettingsMenu"
            open={menuOpen}
            onClose={handleClose}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <MenuItem onClick={handleClose}>Change user avatar</MenuItem>
            <MenuItem onClick={handleClose}>Change password</MenuItem>
          </Menu>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: -1.5,
          }}
        >
          <IconButton>
            <Badge
              overlap="circular"
              badgeContent={
                <Avatar
                  sx={{
                    width: "1.6rem",
                    height: "1.6rem",
                    backgroundColor: "primary.main",
                  }}
                >
                  <AddPhotoAlternateIcon
                    sx={{
                      width: "1.2rem",
                      height: "1.2rem",
                    }}
                  />
                </Avatar>
              }
            >
              <Avatar
                data-testid="userAvatar"
                alt={username}
                src={avatar || "none"}
                sx={{
                  width: "6rem",
                  height: "6rem",
                  fontSize: "2.5rem",
                  border: 2.75,
                  borderColor: "primary.main",
                }}
              />
            </Badge>
          </IconButton>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: -0.5,
            marginBottom: -0.5,
          }}
        >
          <Typography data-testid="userName" sx={{ fontSize: "1.5rem" }}>
            {username}
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: -0.5,
            marginBottom: -0.5,
          }}
        >
          <Divider variant="middle" sx={{ width: "100%" }} />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" color="primary" padding={1}>
            User stats
          </Typography>

          <StatsCard stats={stats} />
        </Grid>
      </Grid>
    </Card>
  );
}
