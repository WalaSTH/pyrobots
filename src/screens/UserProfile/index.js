// import { Container } from "@mui/material";
// import DisplayProfile from "../../components/DisplayProfile";

import { Container } from "@mui/material";
import axios from "axios";
import ProfileCard from "../../components/ProfileCard";

async function getUserStats(username) {
  return await axios
    .get("http://127.0.0.1:8000/user/stats", {
      params: {
        username: username,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error.response);
      return {};
    });
}

export default function UserProfile() {
  const username = localStorage.getItem("username");
  const avatar = localStorage.getItem("avatar");
  const stats = getUserStats(username);

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        marginTop: 10,
      }}
    >
      <ProfileCard username={username} avatar={avatar} stats={stats} />
    </Container>
  );
}
