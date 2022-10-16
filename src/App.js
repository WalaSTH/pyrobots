import { Routes, Route } from "react-router-dom";
import Home from "./screens/Home/Home";
import NewRobot from "./screens/NewRobot";

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="newrobot" element={<NewRobot />} />
      </Routes>
    </div>
  );
}
