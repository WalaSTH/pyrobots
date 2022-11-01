// api/getter
import jwt_decode from "jwt-decode";
import axios from "axios";

const getRobots = async () => {
  let token, decoded, username;

  try {
    token = localStorage.getItem("token");
    decoded = jwt_decode(token);
    username = decoded.sub;
  } catch (err) {
    console.log("Error while decodign the token", err);
  }

  if (!username) {
    console.log("Username does not exist");
    return [];
  }

  const { data, status, statusText } = await axios.get(
    "http://localhost:8000/robot/list",
    {
      params: { user_name: username, detailed: false },
    }
  );

  if (status !== 200) {
    console.log(statusText);
    return [];
  }

  return data.Robots;
};

export default getRobots;
