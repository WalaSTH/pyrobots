import { Home } from "@mui/icons-material";
import { Box, Container, Typography, Button } from "@mui/material";
import SmartToyTwoToneIcon from "@mui/icons-material/SmartToyTwoTone";
import FormatListBulletedTwoToneIcon from "@mui/icons-material/FormatListBulletedTwoTone";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HistoryIcon from "@mui/icons-material/History";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ScienceIcon from "@mui/icons-material/Science";

export default function Leftbar({ navigate, handleLogout }) {
  return (
    <Container
      sx={{
        paddingTop: "100px",
        color: "#fff",
        backgroundColor: "#1976d2",
        height: "100vh",
      }}
    >
      <Box display="flex" alignItems="center" marginBottom={3}>
        <Button
          startIcon={<Home />}
          color="inherit"
          onClick={() => navigate("/")}
        >
          <Typography color="#FFF" textTransform={"none"}>
            Home
          </Typography>
        </Button>
      </Box>
      <Box display="flex" alignItems="center" marginBottom={3}>
        <Button
          startIcon={<AccountBoxIcon />}
          color="inherit"
          onClick={() => navigate("/profile")}
        >
          <Typography color="#FFF" textTransform={"none"}>
            Profile
          </Typography>
        </Button>
      </Box>

      <Box display="flex" alignItems="center" marginBottom={3}>
        <Button
          startIcon={<FormatListBulletedTwoToneIcon />}
          color="inherit"
          onClick={() => navigate("/browse-matches")}
        >
          <Typography color="#FFF" textTransform={"none"}>
            Find match
          </Typography>
        </Button>
      </Box>
      <Box display="flex" alignItems="center" marginBottom={3}>
        <Button
          startIcon={<AddCircleIcon />}
          color="inherit"
          onClick={() => navigate("/create-match")}
        >
          <Typography color="#FFF" textTransform={"none"}>
            Create match
          </Typography>
        </Button>
      </Box>
      <Box display="flex" alignItems="center" marginBottom={3}>
        <Button
          startIcon={<ScienceIcon />}
          color="inherit"
          onClick={() => navigate("/create-simulation")}
        >
          <Typography color="#FFF" textTransform={"none"}>
            Create simulation
          </Typography>
        </Button>
      </Box>
      <Box display="flex" alignItems="center" marginBottom={3}>
        <Button
          startIcon={<SmartToyTwoToneIcon />}
          color="inherit"
          onClick={() => navigate("/create-robot")}
        >
          <Typography color="#FFF" textTransform={"none"}>
            Create robot
          </Typography>
        </Button>
      </Box>
      <Box display="flex" alignItems="center" marginBottom={3}>
        <Button
          startIcon={<HistoryIcon />}
          color="inherit"
          onClick={() => navigate("/match-history")}
        >
          <Typography color="#FFF" textTransform={"none"}>
            Match History
          </Typography>
        </Button>
      </Box>
      <Box display="flex" alignItems="center" marginBottom={3}>
        <Button
          startIcon={<SettingsIcon />}
          color="inherit"
          onClick={() => navigate("/settings")}
        >
          <Typography color="#FFF" textTransform={"none"}>
            Settings
          </Typography>
        </Button>
      </Box>
      <Box display="flex" alignItems="center">
        <Button
          startIcon={<LogoutIcon />}
          color="inherit"
          onClick={handleLogout}
        >
          <Typography color="#FFF" textTransform={"none"}>
            Logout
          </Typography>
        </Button>
      </Box>
    </Container>
  );
}
