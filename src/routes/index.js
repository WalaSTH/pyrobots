import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import Login from "../screens/Login/Login";
import MainPage from "../screens/MainPage/MainPage";
import NewRobot from "../screens/NewRobot";
import Register from "../screens/Register/Register";
import CreateMatch from "../screens/CreateMatch/CreateMatch";
import Lobby from "../screens/Lobby";

export default function RoutesWrapper({ navigate }) {
  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");

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
        <Route
          path="/create-match"
          element={<CreateMatch navigate={navigate} userID={userID} />}
        />
        <Route path="/create-simulation" element={<></>} />
        <Route path="/browse-matches" element={<></>} />
        <Route path="/match-history" element={<></>} />
        <Route path="/lobby/:matchID" element={<Lobby />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
