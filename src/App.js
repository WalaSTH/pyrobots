import { Routes, Route } from "react-router-dom";
import Home from "./screens/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import CreateMatch from "./screens/CreateMatch/CreateMatch";

export default function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-match" element={<CreateMatch />} />
      </Routes>
    </div>
  );
}
