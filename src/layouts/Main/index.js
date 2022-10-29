import { Box } from "@mui/material";
import { useState } from "react";
import Drawer from "../Sidebar";
import Navbar from "../Navbar";

const drawerWidth = 240;

export default function Leftbar({ token, navigate, handleLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box>
      <Navbar
        token={token}
        navigate={navigate}
        handleDrawerToggle={handleDrawerToggle}
        position="fixed"
        sx={{
          display: token ? { xs: "block", md: "none" } : { xs: "block" },
          width: "100vw",
        }}
      />
      {token && (
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          <Drawer
            handleLogout={handleLogout}
            setMobileOpen={setMobileOpen}
            navigate={navigate}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
              },
            }}
          />
          <Drawer
            handleLogout={handleLogout}
            setMobileOpen={setMobileOpen}
            navigate={navigate}
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
              },
            }}
            open
          />
        </Box>
      )}
    </Box>
  );
}
