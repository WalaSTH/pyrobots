import { Routes, Route } from "react-router-dom";
import CreateMatch from "./screens/CreateMatch/CreateMatch";

export default function App() {
  const id = 1;
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/create-match" element={<CreateMatch userID={id} />} />
      </Routes>
    </div>
  );
}
