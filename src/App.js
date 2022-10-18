import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./screens/Login/Login";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user_id, setUserID] = useState(localStorage.getItem("userID"));
  const [username, setUsername] = useState(localStorage.getItem("username"));

  const handleLogin = (t) => {
    localStorage.setItem("token", t.access_token);
    localStorage.setItem("userID", t.id);
    localStorage.setItem("username", t.username);
    setToken(t.access_token);
    setUserID(t.id);
    setUsername(t.username);
    navigate("/");
  };

  const handleLogout = (e) => {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    localStorage.removeItem("userID");
    setToken(null);
    setUserID(null);
    setUsername(null);
    navigate("/");
  };

  return (
    <div className="App">
      <Routes>
        <Route
          exact
          path="/login"
          element={<Login handleLogin={handleLogin} />}
        />
      </Routes>
    </div>
  );
}
