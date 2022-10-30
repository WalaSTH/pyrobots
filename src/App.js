import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Routes from "./routes";
import NavigationLayout from "./layouts/Main";

export default function App() {
  const navigate = useNavigate();
  return (
    <Box display="flex" height="100vh">
      <NavigationLayout navigate={navigate} />
      <Routes navigate={navigate} />
    </Box>
  );
}
