import { Routes, Route } from "react-router-dom";
import Home from "./screens/Home/Home";

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}
