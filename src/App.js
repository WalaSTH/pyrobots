import { Routes, Route } from "react-router-dom";
import Home from "./screens/Home/Home";
import Register from "./screens/Register/Register";
import NavBar from "./components/Navbar/Navbar";

export default function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}
