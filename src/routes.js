import { Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./screens/MainPage/MainPage";

export default function RoutesWrapper({ token, navigate }) {
  const privateRoute = (token, component) => {
    if (token) {
      return component;
    } else {
      return <Navigate to="/" />;
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<MainPage token={token} navigate={navigate} />}
      />
      <Route exact path="/register" element={<></>} />
      <Route exact path="/login" element={<></>} />
      <Route exact path="/create-robot" element={privateRoute(token, <></>)} />
      <Route exact path="/create-match" element={privateRoute(token, <></>)} />
      <Route
        exact
        path="/create-simulation"
        element={privateRoute(token, <></>)}
      />
      <Route exact path="/profile" element={privateRoute(token, <></>)} />
      <Route
        exact
        path="/browse-matches"
        element={privateRoute(token, <></>)}
      />
      <Route exact path="match-history" element={privateRoute(token, <></>)} />
      <Route exact path="settings" element={privateRoute(token, <></>)} />
    </Routes>
  );
}
