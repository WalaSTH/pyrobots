import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import Login from "../screens/Login/";
import MainPage from "../screens/MainPage/";
import NewRobot from "../screens/NewRobot";
import CreateSim from "../screens/CreateSim";
import Register from "../screens/Register/";
import CreateMatch from "../screens/CreateMatch/";

export default function RoutesWrapper({ navigate }) {
  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");
  const username = localStorage.getItem("username");

  return (
    <Routes>
      <Route
        path="/"
        element={<MainPage token={token} navigate={navigate} />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to="/" /> : <Register />}
      />
      <Route
        path="/login"
        element={token ? <Navigate to="/" /> : <Login navigate={navigate} />}
      />
      <Route element={<PrivateRoute />}>
        <Route path="/create-robot" element={<NewRobot userID={userID} />} />
        <Route path="/create-match" element={<CreateMatch userID={userID} />} />
        <Route
          path="/create-simulation"
          element={<CreateSim username={username} navigate={navigate} />}
        />
        <Route path="/browse-matches" element={<></>} />
        <Route path="/match-history" element={<></>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
