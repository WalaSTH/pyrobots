import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import Login from "../screens/Login/";
import MainPage from "../screens/MainPage/";
import NewRobot from "../screens/NewRobot";
import Register from "../screens/Register/";
import CreateMatch from "../screens/CreateMatch/";
import BrowseMatches from "../screens/BrowseMatches";

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
        <Route path="/browse-matches" element={<BrowseMatches />} />
        <Route path="/create-robot" element={<NewRobot UserID={userID} />} />
        <Route path="/create-match" element={<CreateMatch UserID={userID} />} />
        <Route path="/create-simulation" element={<></>} />
        <Route path="/match-history" element={<></>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
