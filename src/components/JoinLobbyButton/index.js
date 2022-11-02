import { Box, Fab } from "@mui/material";
import { useState } from "react";
import { blue } from "@mui/material/colors";
import PasswordDialog from "../PasswordDialog";
import RobotDialog from "../RobotDialog";
import LoginIcon from "@mui/icons-material/Login";

export default function JoinLobby({ params }) {
  const [robotDialogOpen, setRobotDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const handleCloseRobot = () => {
    setRobotDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setPasswordDialogOpen(false);
  };

  return (
    <Box>
      <Box>
        <Fab
          variant="extended"
          sx={{
            color: "#fff",
            width: 50,
            height: 40,
            bgcolor: "primary.main",
            "&:hover": { bgcolor: blue[400] },
          }}
          onClick={() =>
            params.row.password
              ? setPasswordDialogOpen(true)
              : setRobotDialogOpen(true)
          }
        >
          <LoginIcon />
        </Fab>
      </Box>
      <RobotDialog
        open={robotDialogOpen}
        handleClose={handleCloseRobot}
        id={params.row.id}
      />
      <PasswordDialog
        open={passwordDialogOpen}
        handleClose={handleCloseDialog}
        id={params.row.id}
      />
    </Box>
  );
}
