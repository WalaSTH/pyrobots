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
import ResetPassword from "../screens/ResetPassword";
import UserProfile from "../screens/UserProfile";
import Recover from "../screens/Recover";
import ValidateAccount from "../screens/ValidateAccount";

export default function RoutesWrapper({ navigate }) {
  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");
  const username = localStorage.getItem("username");
  const simID = localStorage.getItem("simID");
  if (simID && window.location.pathname !== "/board/" + simID) {
    localStorage.removeItem(simID);
    localStorage.removeItem("simID");
  }

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
      <Route path="/recover" element={<Recover />} />
      <Route path="/reset-password/" element={<ResetPassword />} />
      <Route path="/validate-account" element={<ValidateAccount />} />
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
        <Route path="/profile" element={<UserProfile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
