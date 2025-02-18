import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  Board,
  Dashboard,
  DashboardPage,
  Epics,
  // Login,
  ProjectList,
  Retrospective,
  SprintBoardPage,
} from "./pages";
import { Layout } from "./components";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
        <Route  path="/projects" element={<ProjectList />} />
        <Route path="/projects/:id" element={<Layout />}>
          <Route index element={<Navigate to="board" />} /> {/* Redirección */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="board" element={<Board />} />
          <Route path="retrospective" element={<Retrospective />} />
          <Route path="epics" element={<Epics />} />
        </Route>
        <Route path="*" element={<Navigate to="/projects" />} />

        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/sprint-board" element={<SprintBoardPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
