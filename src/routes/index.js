import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import Login from "../screens/Login/";
import MainPage from "../screens/MainPage/";
import NewRobot from "../screens/NewRobot";
import ListRobot from "../screens/ListRobots/ListRobots";
import CreateSim from "../screens/CreateSim";
import Register from "../screens/Register/";
import CreateMatch from "../screens/CreateMatch/";
import Lobby from "../screens/Lobby";
import BrowseMatches from "../screens/BrowseMatches";
import Board from "../screens/Board";
import UserProfile from "../screens/UserProfile";

export default function RoutesWrapper({ navigate, avatar, setAvatar }) {
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
      <Route path="/recover" element={<></>} />
      <Route element={<PrivateRoute />}>
        <Route path="/list-robot" element={<ListRobot />} />
        <Route path="/browse-matches" element={<BrowseMatches />} />
        <Route path="/create-robot" element={<NewRobot userID={userID} />} />
        <Route path="/create-match" element={<CreateMatch userID={userID} />} />
        <Route
          path="/create-simulation"
          element={<CreateSim username={username} navigate={navigate} />}
        />
        <Route path="/board/:simID" element={<Board />} />
        <Route path="/match-history" element={<></>} />
        <Route path="/lobby/:matchID" element={<Lobby />} />
        <Route
          path="/profile"
          element={<UserProfile avatar={avatar} setAvatar={setAvatar} />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
