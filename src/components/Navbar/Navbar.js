import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  Button,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";

export default function Navbar({ token, navigate }) {
  function handleClick() {
    navigate("/");
  }
  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: "0px 1px 25px 0px rgb(0, 0, 0)",
      }}
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="logo"
          onClick={handleClick}
        >
          <SmartToyIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PY-ROBOTS
        </Typography>
        <Box display="flex" alignItems="center">
          {!token && (
            <>
              <Button onClick={() => navigate("/")} color="inherit">
                Home
              </Button>
              <Button onClick={() => navigate("/login")} color="inherit">
                Login
              </Button>
              <Button onClick={() => navigate("/register")} color="inherit">
                Register
              </Button>
            </>
          )}
          {token && (
            <>
              <IconButton onClick={() => navigate("/profile")}>
                <Avatar alt="User Avatar" />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
