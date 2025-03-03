import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  Board,
  Dashboard,
  Epics,
  // Login,
  ProjectList,
  Retrospective,
  SettingsPage,
  TeamMembersPage,
} from "./pages";
import { ProjectLayout } from "./components";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/:id" element={<ProjectLayout />}>
          <Route index element={<Navigate to="overview" replace />} />{" "}
          {/* ✅ FIX */}
          <Route path="overview" element={<Dashboard />} />
          <Route path="board" element={<Board />} />
          <Route path="retrospective" element={<Retrospective />} />
          <Route path="epics" element={<Epics />} />
          <Route path="teammembers" element={<TeamMembersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/projects" />} />

        {/* <Route path="/" element={<Login />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
