import { Container, Card, Button } from "@mui/material";
import TableBasic from "../../components/LobbyList";
import FilterButton from "../../components/FilterButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function BrowseMatches() {
  return (
    <Container sx={{ marginTop: { xs: 9, md: 4 } }}>
      <Card
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          backgroundColor: "#efefef",
        }}
      >
        <Button startIcon={<RefreshIcon />}>Refresh</Button>
        <FilterButton endIcon={<FilterListIcon />} />
      </Card>
      <TableBasic />
    </Container>
  );
}
