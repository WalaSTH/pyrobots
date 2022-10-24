import CreateMatchForm from "../../components/FormsUI/CreateMatchForm";
import { Container } from "@mui/material";

export default function CreateGame({ UserID }) {
  return (
    <Container component="main" maxWidth="xs">
      <CreateMatchForm UserID={UserID} />
    </Container>
  );
}
