import { Box, Fab } from "@mui/material";
import { useState } from "react";
import { blue } from "@mui/material/colors";
import ResultDialog from "../ResultDialog";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import axios from "axios";

const resultEndpoint = "http://127.0.0.1:8000/match/result";

export default function SeeResultsButton({ params }) {
  const username = localStorage.getItem("username");

  const [resultsDialog, setResultsDialog] = useState(false);
  const [result, setResult] = useState({});

  const handleCloseDialog = () => {
    setResultsDialog(false);
  };

  async function getResult() {
    await axios
      .get(resultEndpoint, {
        params: {
          match_id: params.row.id,
          username: username,
        },
      })
      .then((response) => {
        setResult(response.data["data"]);
      })
      .catch((error) => {});
  }

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
          onClick={() => {
            setResultsDialog(true);
            getResult();
          }}
        >
          <ZoomInIcon />
        </Fab>
      </Box>
      <ResultDialog
        open={resultsDialog}
        handleClose={handleCloseDialog}
        id={params.row.id}
        params={params}
        result={result}
      />
    </Box>
  );
}
