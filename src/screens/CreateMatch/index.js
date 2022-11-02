import CreateMatchForm from "../../components/FormsUI/CreateMatchForm";
import { Container } from "@mui/material";

export default function CreateMatch({ userID }) {
  return (
    <Container component="main" maxWidth="xs">
      <CreateMatchForm UserID={userID} />
    </Container>
  );
}
