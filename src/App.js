import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./screens/Login/Login";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="App">
      <Navbar />
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
