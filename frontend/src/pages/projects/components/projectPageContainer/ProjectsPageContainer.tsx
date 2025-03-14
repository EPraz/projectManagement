import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Project } from "../../../../types";
import {
  useCreateProject,
  useDebounce,
  useLoadProject,
} from "../../../../hooks";
import { useAuth } from "../../../../context";
import { Role } from "../../../../constants";
import { Box, useTheme } from "@mui/material";
import { DialogForm, Loading, Portal } from "../../../../components";
import { useNavigate } from "react-router-dom";
import { createProjectSchema } from "../../../../validations";
import { ProjectsContainer } from "../../ProjectsPage.styles";
import ProjectContainerView from "../projectContainerView/ProjectContainerView";
import ProjectMenu from "../projectMenu/ProjectMenu";

const ProjectsPageContainer = () => {
  const { user } = useAuth();
  const { loadProjects, loading } = useLoadProject();
  const { createProject, loading: postProjectLoading } = useCreateProject();
  const navigate = useNavigate();
  const theme = useTheme();

  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchInput, 300); // 300ms delay

  const [projects, setProjects] = useState<Project[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [_, setSelectedProject] = useState<string | null>(null);

  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  const [view, setView] = useState<"grid" | "list">(() => {
    // Recuperar la vista guardada en localStorage o usar la inicial
    const savedView = localStorage.getItem("projectListView");
    return savedView === "list" || savedView === "grid" ? savedView : "grid";
  });

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await loadProjects();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
    },
    []
  );

  // Guardar la vista seleccionada en localStorage
  const handleViewChange = useCallback((newView: "grid" | "list") => {
    setView(newView);
    localStorage.setItem("projectListView", newView);
  }, []);

  // Check if user has permission to create projects
  const canCreateProject = useMemo(() => {
    if (!user || !user.role) return false;
    return [Role.ADMIN, Role.PROJECT_MANAGER].includes(user.role);
  }, [user]);

  const handleCreateProject = async (data: Partial<Project>) => {
    const newProject = await createProject(data);
    if (newProject) {
      setOpenDialog(false);
      setProjects([...projects, newProject]);
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    projectId: string
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedProject(projectId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) =>
        project.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (a.id === favoriteId) return -1;
        if (b.id === favoriteId) return 1;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [projects, debouncedSearchQuery, favoriteId]);

  if (loading || postProjectLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Loading />
      </Box>
    );
  }

  return (
    <ProjectsContainer>
      <ProjectContainerView
        projects={filteredProjects}
        loading={loading}
        searchInput={searchInput}
        handleSearchChange={handleSearchChange}
        handleViewChange={handleViewChange}
        view={view}
        canCreateProject={canCreateProject}
        setOpenDialog={setOpenDialog}
        favoriteId={favoriteId}
        filteredProjects={filteredProjects}
        handleMenuClick={handleMenuClick}
        navigate={navigate}
        setFavoriteId={setFavoriteId}
        theme={theme}
      />
      {anchorEl && (
        <Portal>
          <ProjectMenu anchorEl={anchorEl} handleMenuClose={handleMenuClose} />
        </Portal>
      )}

      {openDialog && (
        <DialogForm
          open={openDialog}
          title="Create Project"
          onClose={() => setOpenDialog(false)}
          onSubmit={handleCreateProject}
          schema={createProjectSchema}
          disabled={postProjectLoading}
          defaultValues={{
            title: "",
            description: "",
          }}
        />
      )}
    </ProjectsContainer>
  );
};

export default ProjectsPageContainer;
