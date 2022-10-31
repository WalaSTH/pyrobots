import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import Home from "@mui/icons-material/Home";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SmartToyTwoToneIcon from "@mui/icons-material/SmartToyTwoTone";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import IconButton from "@mui/material/IconButton";

const theme = createTheme({
  typography: {
    allVariants: {
      color: "#fff",
    },
  },
});

export default function DrawerWrapper({
  setMobileOpen,
  navigate,
  ...otherProps
}) {
  const username = localStorage.getItem("username");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    localStorage.removeItem("username");
    navigate("/");
  }

  return (
    <Drawer {...otherProps}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            textAlign: "center",
            backgroundColor: "#1976d2",
            height: "100%",
          }}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="logo"
              onClick={() => navigate("/")}
            >
              <SmartToyIcon sx={{ color: "#fff" }} />
            </IconButton>
            <Typography variant="h6" sx={{ my: 2 }} color="#fff">
              Py Robots
            </Typography>
          </Box>
          <Divider />
          <List>
            <Box
              sx={{
                marginTop: "10px",
                marginBottom: "5px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                src="null"
                alt={username}
                sx={{ color: "#fff", marginBottom: "3px" }}
              />
              <Typography>{username}</Typography>
            </Box>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/")}>
                <ListItemIcon>
                  <Home sx={{ color: "#fff " }} />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/create-match")}>
                <ListItemIcon>
                  <AddCircleIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText primary="Create match" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/create-simulation")}>
                <ListItemIcon>
                  <PlayCircleIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText primary="Create simulation" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/create-robot")}>
                <ListItemIcon>
                  <SmartToyTwoToneIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText primary="Create robot" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  handleLogout();
                  setMobileOpen();
                }}
              >
                <ListItemIcon>
                  <LogoutIcon sx={{ color: "#fff" }} />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </ThemeProvider>
    </Drawer>
  );
}
