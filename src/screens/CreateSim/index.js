import { Container } from "@mui/material";
import CreateSimForm from "../../components/CreateSimForm";
import axios from "axios";

export default function CreateSim({ UserID }) {
  async function handleSubmit(values) {
    console.log(values);
  }

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        marginTop: 20,
      }}
    >
      <CreateSimForm onSubmit={handleSubmit} />
    </Container>
  );
}
