import React, { useState, useCallback, useMemo } from "react";
import { Project } from "../../../../types";
import {
  useCreateProject,
  useDebounce,
  useDeleteProject,
  useLoadProject,
} from "../../../../hooks";
import { useAuth } from "../../../../context";
import { Role } from "../../../../constants";
import { Alert, Button, useTheme } from "@mui/material";
import { DialogForm, Portal } from "../../../../components";
import { useNavigate } from "react-router-dom";
import { createProjectSchema } from "../../../../validations";
import { ProjectsContainer } from "../../ProjectsPage.styles";
import ProjectContainerView from "../projectContainerView/ProjectContainerView";
import ProjectMenu from "../projectMenu/ProjectMenu";

const ProjectsPageContainer = () => {
  const { user } = useAuth();
  const { projects, setProjects, loadProjects, loading, hasLoaded, error } =
    useLoadProject();
  const { createProject, loading: postProjectLoading } = useCreateProject();
  const { deleteProject, loading: deleteProjectLoading } = useDeleteProject();
  const navigate = useNavigate();
  const theme = useTheme();

  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchInput, 300); // 300ms delay

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  const [view, setView] = useState<"grid" | "list">(() => {
    // Recuperar la vista guardada en localStorage o usar la inicial
    const savedView = localStorage.getItem("projectListView");
    return savedView === "list" || savedView === "grid" ? savedView : "grid";
  });

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
    },
    [],
  );

  // Guardar la vista seleccionada en localStorage
  const handleViewChange = useCallback((newView: "grid" | "list") => {
    setView(newView);
    localStorage.setItem("projectListView", newView);
  }, []);

  // Check if user has permission to create projects
  const asPermission = useMemo(() => {
    if (!user || !user.role) return false;
    return [Role.ADMIN, Role.PROJECT_MANAGER].includes(user.role);
  }, [user]);

  const handleCreateProject = async (data: Partial<Project>) => {
    const newProject = await createProject({ ...data, createdBy: user?.email });
    setProjects((current) => [...current, newProject]);
    return true;
  };

  const handleDeleteProject = async (data: Partial<Project>) => {
    const success = await deleteProject(data);
    if (success) {
      await loadProjects();
    }
    return success;
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    projectId: string,
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
        project.title
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()),
      )
      .sort((a, b) => {
        if (a.id === favoriteId) return -1;
        if (b.id === favoriteId) return 1;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [projects, debouncedSearchQuery, favoriteId]);

  return (
    <ProjectsContainer>
      {error && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              disabled={loading}
              onClick={() => {
                void loadProjects();
              }}
            >
              Retry projects
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      {
        <ProjectContainerView
          projects={filteredProjects}
          loading={loading && !hasLoaded}
          unavailable={Boolean(error && !hasLoaded)}
          refreshing={loading}
          onRefresh={() => {
            void loadProjects();
          }}
          searchInput={searchInput}
          handleSearchChange={handleSearchChange}
          handleViewChange={handleViewChange}
          view={view}
          canCreateProject={asPermission}
          setOpenDialog={setOpenDialog}
          favoriteId={favoriteId}
          filteredProjects={filteredProjects}
          handleMenuClick={handleMenuClick}
          navigate={navigate}
          setFavoriteId={setFavoriteId}
          theme={theme}
        />
      }
      {anchorEl && (
        <Portal>
          <ProjectMenu
            anchorEl={anchorEl}
            handleMenuClose={handleMenuClose}
            handleDeleteProject={handleDeleteProject}
            asPermission={asPermission}
            selectedProjectId={selectedProject}
            projectTitle={
              projects.find((project) => project.id === selectedProject)
                ?.title ?? "this project"
            }
            loading={deleteProjectLoading}
          />
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
