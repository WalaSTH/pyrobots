import { Box, Fab } from "@mui/material";
import { useState } from "react";
import { blue } from "@mui/material/colors";
import ResultDialog from "../ResultDialog";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

export default function SeeResultsButton({ params }) {
  const [resultsDialog, setResultsDialog] = useState(false);

  const handleCloseDialog = () => {
    setResultsDialog(false);
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
          onClick={() => setResultsDialog(true)}
        >
          <VisibilityOutlinedIcon />
        </Fab>
      </Box>
      <ResultDialog
        open={resultsDialog}
        handleClose={handleCloseDialog}
        id={params.row.id}
        params={params}
      />
    </Box>
  );
}
