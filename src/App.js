import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./screens/home/Home";
import Register from "./screens/register/Register";
import Login from "./screens/login/Login";
import RoleManagement from "./screens/roleManagement/RoleManagement";
import { UserContext } from "./contexts/userContext/UserContext";
import CellGroupManager from "./screens/cellGroupManager/CellGroupManager";
import CreateZone from "./screens/createZone/CreateZone";
import CreateCellGroup from "./screens/createCellGroup/CreateCellGroup";
import About from "./screens/about/About";
import WorshipSongs from "./screens/worshipSongs/WorshipSongs";
import PrayerPage from "./screens/prayerPage/PrayerPage";

function App() {
  const { state } = useContext(UserContext);

  if (state.loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/worship-songs" element={<WorshipSongs />} />
        {state.role && ["admin", "moderator"].includes(state.role) && (
          <Route path="/manage-roles" element={<RoleManagement />} />
        )}
        <Route path="*" element={<Navigate to="/" />} />{" "}
        <Route path="/manage-members" element={<CellGroupManager />} />
        <Route path="/create-zone" element={<CreateZone />} />
        <Route path="/create-cell-group" element={<CreateCellGroup />} />
        <Route path="/prayers" element={<PrayerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
