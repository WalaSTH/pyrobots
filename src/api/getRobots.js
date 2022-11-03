import axios from "axios";

export default async function getRobots() {
  const username = localStorage.getItem("username");

  return await axios
    .get("http://localhost:8000/robot/list", {
      params: { user_name: username, detailed: false },
    })
    .then((response) => {
      return response.data["Robots"];
    });
}
