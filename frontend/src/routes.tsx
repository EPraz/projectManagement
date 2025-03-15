import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  Board,
  Epics,
  InstantLogin,
  Login,
  Register,
  Retrospective,
  SettingsPage,
  TeamMembersPage,
  Projects,
  DashBoard,
} from "./pages";
import { PrivateRoute, ProjectLayout } from "./components";
import { AuthProvider } from "./context";

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<PrivateRoute />}>
            {/* <Route path="/login" element={<Login />} /> */}
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectLayout />}>
              <Route index element={<Navigate to="overview" replace />} />{" "}
              {/* FIX */}
              <Route path="overview" element={<DashBoard />} />
              <Route path="board" element={<Board />} />
              <Route path="retrospective" element={<Retrospective />} />
              <Route path="epics" element={<Epics />} />
              <Route path="teammembers" element={<TeamMembersPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            {/* <Route path="profile" element={<SettingsPage />} /> */}

            <Route path="*" element={<Navigate to="/projects" />} />
          </Route>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/instantLogin" element={<InstantLogin />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
