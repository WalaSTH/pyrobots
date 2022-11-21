import CreateMatchForm from "../../components/FormsUI/CreateMatchForm";
import { Container } from "@mui/material";

export default function CreateGame({ userID }) {
  return (
    <Container component="main" maxWidth="xs">
      <CreateMatchForm userID={userID} />
    </Container>
  );
}
