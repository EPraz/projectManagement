import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DashboardPage, SprintBoardPage } from "./pages";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/sprint-board" element={<SprintBoardPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
