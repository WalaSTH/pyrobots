// MUI components
import { Container } from "@mui/material";
import axios from "axios";
import NewRobotForm from "../../components/NewRobotForm";

export default function NewRobot({ userID }) {
  // Connection with endpoint
  async function handleSubmit(values) {
    const formData = new FormData();
    formData.append("code", values.code);
    if (values.avatar) {
      formData.append("avatar", values.avatar);
    } else {
      const avatar = new File([], "null.png", {
        type: "image/png",
      });
      formData.append("avatar", avatar);
    }

    return axios
      .post("http://127.0.0.1:8000/robot/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: { robot_name: values.name, creator: userID },
      })
      .then(function (response) {
        console.log("Success" + response.data);
        if (response.status === 200) {
          console.log("Success!" + response.data);
          return;
        } else if (response.status === 400) {
          console.log("Invalid robot name" + response.data);
          return;
        } else if (response.status === 404) {
          console.log("Invalid user ID" + response.data);
          return;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        marginTop: 10,
      }}
    >
      <NewRobotForm onSubmit={handleSubmit} />
    </Container>
  );
}
