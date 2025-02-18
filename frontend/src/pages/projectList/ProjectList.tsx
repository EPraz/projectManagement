import React, { useCallback, useEffect, useState } from "react";
import {
  Container,
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  CardActions,
} from "@mui/material";
import { useApi } from "../../context";
import { Project } from "../../types";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { NewProjectDialog } from "../../components";

const ProjectList = () => {
  const { apiUrl } = useApi();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // 📌 Cargar proyectos desde el backend
  const loadProjects = useCallback(async () => {
    console.log("insde");
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/projects/`);
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Project List
      </Typography>

      {/* Mensaje de Error */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Cargando proyectos */}
      {loading ? (
        <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />
      ) : (
        <Grid container spacing={3}>
          {/* Mostrar lista de proyectos */}
          {projects.map((project) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 },
                }}
                onClick={() => navigate(`/projects/${project.id}/board`)}
              >
                <CardContent>
                  <FolderOpenIcon
                    fontSize="large"
                    sx={{ mb: 1, color: "primary.main" }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    {project.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {project.description || "No description available"}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Typography variant="caption" color="textSecondary">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
          ))}

          {/* Botón para agregar nuevo proyecto */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 150,
                cursor: "pointer",
                border: "2px dashed grey",
                "&:hover": { borderColor: "primary.main" },
              }}
              onClick={() => setOpenDialog(true)}
            >
              <IconButton color="primary">
                <AddIcon fontSize="large" />
              </IconButton>
            </Card>
          </Grid>
        </Grid>
      )}

      {openDialog && (
        <NewProjectDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
        />
      )}
    </Container>
  );
};

export default React.memo(ProjectList);
