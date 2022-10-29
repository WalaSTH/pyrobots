import { Box, Typography, Button, styled } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export default function Navbar({
  token,
  navigate,
  handleDrawerToggle,
  ...otherProps
}) {
  return (
    <AppBar {...otherProps}>
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
            {/* <Box>
                <Avatar sx={{ width: "30px", height: "30px" }} />
              </Box> */}
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
  );
}
