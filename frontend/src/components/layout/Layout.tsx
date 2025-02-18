import { Outlet, useParams } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Sidebar from "../sidebar/Sidebar";
import SprintSelector from "../sprintSelector/SprintSelector";
// import { useEffect } from "react";
import { useApi } from "../../context";

const Layout = () => {
  const { id } = useParams(); // Obtiene el ID del proyecto desde la URL
  const { apiUrl } = useApi();
  // const { taskStatuses, ticketStatuses } = useProject();
  // const [projects, setProjects] = useState<any[]>([]);

  // useEffect(() => {
  //   fetch(`${apiUrl}/projects`, {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   })
  //     .then((res) => res.json())
  //     // .then((data) => setProjects(data))
  //     .then((data) => console.log(data))
  //     .catch((error) => console.error("Error loading projects:", error));
  // }, []);

  const createProject = async (title: string, description: string) => {
    try {
      const response = await fetch(`${apiUrl}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          createdBy: "test-user@example.com",
        }), // Placeholder for now
      });

      if (!response.ok) throw new Error("Failed to create project");

      const newProject = await response.json();
      console.log(newProject);
      // setProjects((prev) => [...prev, newProject]);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div style={{ display: "flex", border: "1px solid green" }}>
      <Sidebar projectId={id!} onProjectCreate={createProject} />
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
