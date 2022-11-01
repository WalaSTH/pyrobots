import { Box, Fab } from "@mui/material";
import { useState } from "react";
import { blue } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import PasswordDialog from "../PasswordDialog";
import LoginIcon from "@mui/icons-material/Login";

export default function JoinLobby({ params }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
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
              ? setOpen(true)
              : navigate(`/lobby/${params.id}`)
          }
        >
          <LoginIcon />
        </Fab>
      </Box>
      <PasswordDialog open={open} handleClose={handleClose} />
    </Box>
  );
}
