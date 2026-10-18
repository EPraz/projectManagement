import { lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import InstantLogin from "./pages/instantLogin/InstantLogin";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import DeferredSurface from "./components/deferredSurface/DeferredSurface";
import { AuthProvider } from "./context/authContext";

const Projects = lazy(() => import("./pages/projects/ProjectsPage"));
const ProjectLayout = lazy(() => import("./components/layout/ProjectLayout"));
const Dashboard = lazy(() => import("./pages/overview/Dashboard"));
const Board = lazy(() => import("./pages/board/Board"));
const Retrospective = lazy(
  () => import("./pages/retrospectivePage/RetrospectivePage")
);
const Epics = lazy(() => import("./pages/epicsAndFeatures/EpicsAndFeatures"));
const TeamMembers = lazy(() => import("./pages/teamMembers/TeamMembersPage"));
const Settings = lazy(() => import("./pages/settingsPage/SettingsPage"));

const AppRoutes = () => (
  <Router>
    <AuthProvider>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route
            path="/projects"
            element={
              <DeferredSurface key="projects" label="projects">
                <Projects />
              </DeferredSurface>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <DeferredSurface key="workspace" label="workspace">
                <ProjectLayout />
              </DeferredSurface>
            }
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route
              path="overview"
              element={
                <DeferredSurface key="overview" label="overview">
                  <Dashboard />
                </DeferredSurface>
              }
            />
            <Route
              path="board"
              element={
                <DeferredSurface key="board" label="Board">
                  <Board />
                </DeferredSurface>
              }
            />
            <Route
              path="retrospective"
              element={
                <DeferredSurface key="retro" label="retrospective">
                  <Retrospective />
                </DeferredSurface>
              }
            />
            <Route
              path="epics"
              element={
                <DeferredSurface key="epics" label="hierarchy">
                  <Epics />
                </DeferredSurface>
              }
            />
            <Route
              path="teammembers"
              element={
                <DeferredSurface key="team" label="team members">
                  <TeamMembers />
                </DeferredSurface>
              }
            />
            <Route
              path="settings"
              element={
                <DeferredSurface key="settings" label="settings">
                  <Settings />
                </DeferredSurface>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/projects" />} />
        </Route>
        <Route
          path="/auth/login"
          element={<Navigate to="/auth/instantLogin" replace />}
        />
        <Route
          path="/auth/register"
          element={<Navigate to="/auth/instantLogin" replace />}
        />
        <Route path="/auth/instantLogin" element={<InstantLogin />} />
      </Routes>
    </AuthProvider>
  </Router>
);
export default AppRoutes;
