import { Box, Fab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import { blue } from "@mui/material/colors";

export default function JoinLobby({ params }) {
  const navigate = useNavigate();

  return (
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
        onClick={() => navigate(`/lobby/${params.id}`)}
      >
        <LoginIcon />
      </Fab>
    </Box>
  );
}
