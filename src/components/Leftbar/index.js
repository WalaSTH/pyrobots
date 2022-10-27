import { Home } from "@mui/icons-material";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Button,
  styled,
  Avatar,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SmartToyTwoToneIcon from "@mui/icons-material/SmartToyTwoTone";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";

const drawerWidth = 240;

const theme = createTheme({
  typography: {
    allVariants: {
      color: "#fff",
    },
  },
});

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export default function Leftbar({ token, navigate, handleLogout }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          textAlign: "center",
          backgroundColor: "#1976d2",
          height: "100%",
          paddingTop: "65px",
        }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/")}>
              <ListItemIcon className="{classes.icon}">
                <Home sx={{ color: "#fff" }} />
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
  );

  return (
    <Box>
      <AppBar
        position="fixed"
        sx={{
          // width: token ? { md: `calc(50% - ${drawerWidth})` } : "100vw",
          width: "100vw",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          //   ml: { sm: `${drawerWidth}px` },
        }}
      >
        <StyledToolbar>
          {token && (
            <>
              <Box>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { md: "none" } }}
                >
                  <MenuIcon />
                </IconButton>
                <Box sx={{ display: { xs: "none", md: "flex" } }}>
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
                    Py-Robots
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Avatar sx={{ width: "30px", height: "30px" }} />
              </Box>
            </>
          )}
          {!token && (
            <>
              <Box display="flex">
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="logo"
                  onClick={() => navigate("/")}
                >
                  <SmartToyIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  sx={{ display: { xs: "none", md: "inline" }, my: 2 }}
                  color="#fff"
                >
                  Py-Robots
                </Typography>
              </Box>
              <Box>
                <Button onClick={() => navigate("/")} color="inherit">
                  Home
                </Button>
                <Button onClick={() => navigate("/login")} color="inherit">
                  Login
                </Button>
                <Button onClick={() => navigate("/register")} color="inherit">
                  Register
                </Button>
              </Box>
            </>
          )}
        </StyledToolbar>
      </AppBar>
      {token && (
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
      )}
    </Box>
  );
}
