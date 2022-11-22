import {
  Box,
  Dialog,
  DialogContent,
  Stack,
  Typography,
  IconButton,
  Avatar,
  styled,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { grey } from "@mui/material/colors";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: grey[100],
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  color: theme.palette.text.secondary,
}));

const color = ["#FFD700", "#C0C0C0", "#CD7F32"];

export default function RobotDialog({ open, handleClose, params, result }) {
  const result_list =
    result &&
    result.robot_list &&
    result.robot_list.map((r) => {
      return (
        <Accordion key={r.username} width="100%">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Box display="flex" alignItems="center">
              {r.position < 4 && (
                <EmojiEventsIcon sx={{ color: color[r.position - 1] }} />
              )}
              <Avatar
                src={r.avatar}
                sx={{ width: "35px", height: "35px", ml: "10px" }}
              />
              <Typography ml="10px">{r.name}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Stack>
              <Item>Position: {r.position}</Item>
              <Item>Games won: {r.victories}</Item>
              <Item>Games lost: {r.loses}</Item>
              <Item>Owner: {r.username}</Item>
            </Stack>
          </AccordionDetails>
        </Accordion>
      );
    });
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: grey[300],
        },
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        sx={{ marginTop: "10px", marginBottom: "-10px" }}
      >
        <IconButton onClick={handleClose}>
          <ArrowBackIcon color="primary" />
        </IconButton>
        <Box width="100%" justifyContent="center" sx={{ marginRight: "35px" }}>
          <Typography
            component="h1"
            variant="h6"
            color="primary"
            textAlign="center"
          >
            Result of {params.row.name}
          </Typography>
        </Box>
      </Box>
      <DialogContent>{result_list}</DialogContent>
    </Dialog>
  );
}
