import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "./HomeStyle.css";

export default function Home(props) {
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    props.setToken(null);
    navigate("/login");
  };

  return (
    <div className="divHome">
      <Button
        onClick={handleLogout}
        sx={{ backgroundColor: "black", height: 1 / 18 }}
      >
        Logout
      </Button>
    </div>
  );
}
