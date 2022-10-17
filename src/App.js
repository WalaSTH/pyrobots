import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./screens/Home/Home";
import Login from "./screens/Login/Login";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";

export default function App() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (t) => {
    localStorage.setItem("token", t.access_token);
    setToken(t.access_token);
    navigate("/");
  };

  const handleLogout = (e) => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  const privateRoute = (token, component) => {
    if (token) {
      return component;
    } else {
      return <Navigate to="/" />;
    }
  };

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home handleLogout={handleLogout} />} />
        <Route
          exact
          path="/login"
          element={<Login handleLogin={handleLogin} />}
        />
        <Route exact path="/register" element={privateRoute(token, Login)} />
      </Routes>
    </div>
  );
}
