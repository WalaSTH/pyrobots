import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./screens/Home/Home";
import Login from "./screens/Login/Login";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";

export default function App() {
  const navigate = useNavigate();
  const [token, setToken] = useState();

  const manageToken = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home setToken={setToken} />} />
        <Route exact path="/login" element={<Login setToken={manageToken} />} />
      </Routes>
    </div>
  );
}
