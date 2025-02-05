import { Outlet, useParams } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Sidebar from "../sidebar/Sidebar";
import SprintSelector from "../sprintSelector/SprintSelector";

const Layout = () => {
  const { id } = useParams(); // Obtiene el ID del proyecto desde la URL

  return (
    <div style={{ display: "flex" }}>
      <Sidebar projectId={id!} />
      <Container sx={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
        <Box sx={{ marginBottom: 2 }}>
          <SprintSelector />
        </Box>
        <Outlet />
      </Container>
    </div>
  );
};

export default Layout;
