// import { Container } from "@mui/material";
// import DisplayProfile from "../../components/DisplayProfile";

import { Container } from "@mui/material";
import UserProfile from "../../components/UserProfile";

export default function Profile() {
  const username = localStorage.getItem("username");
  const avatar = localStorage.getItem("avatar");
  const stats = {};

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        marginTop: 10,
      }}
    >
      <UserProfile username={username} avatar={avatar} stats={stats} />
    </Container>
  );
}
