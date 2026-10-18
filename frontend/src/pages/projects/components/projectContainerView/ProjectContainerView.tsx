import { ProjectContainerViewProps } from "../../../../types";

import { Loading } from "../../../../components";

import ProjectHeader from "../projectHeader/ProjectHeader";

import { Box, Typography } from "@mui/material";

import ProjectEmptyView from "../projectEmptyView/ProjectEmptyView";

import ProjectGridView from "../projectGridView/ProjectGridView";

import ProjectListView from "../projectListView/ProjectListView";

const ProjectContainerView = ({
  projects,

  loading,

  unavailable,

  refreshing,

  onRefresh,

  searchInput,

  handleSearchChange,

  handleViewChange,

  view,

  canCreateProject,

  setOpenDialog,

  favoriteId,

  filteredProjects,

  handleMenuClick,

  setFavoriteId,

  navigate,

  theme,
}: ProjectContainerViewProps) => {
  return (
    <Box>
      <ProjectHeader
        refreshing={refreshing}
        onRefresh={onRefresh}
        searchInput={searchInput}
        handleSearchChange={handleSearchChange}
        handleViewChange={handleViewChange}
        view={view}
        canCreateProject={canCreateProject}
        setOpenDialog={setOpenDialog}
      />

      {loading ? (
        <Box role="status" sx={{ p: 6 }}>
          <Loading />
          <Typography color="text.secondary" align="center">
            Loading projects…
          </Typography>
        </Box>
      ) : unavailable ? null : projects.length === 0 && searchInput.trim() ? (
        <Box role="status" sx={{ p: 4, textAlign: "center" }}>
          <Typography component="h2" variant="h3">
            No matching projects
          </Typography>
          <Typography color="text.secondary">
            Try another project name.
          </Typography>
        </Box>
      ) : projects.length === 0 ? (
        <ProjectEmptyView
          canCreateProject={canCreateProject}
          setOpenDialog={setOpenDialog}
        />
      ) : view === "grid" ? (
        <ProjectGridView
          favoriteId={favoriteId}
          filteredProjects={filteredProjects}
          handleMenuClick={handleMenuClick}
          setFavoriteId={setFavoriteId}
        />
      ) : (
        <ProjectListView
          favoriteId={favoriteId}
          filteredProjects={filteredProjects}
          handleMenuClick={handleMenuClick}
          navigate={navigate}
          setFavoriteId={setFavoriteId}
          theme={theme}
        />
      )}

      <Box
        sx={{
          mt: 3,
          p: 3,
          bgcolor: "background.paper",
          borderLeft: "3px solid",
          borderColor: "primary.main",
          borderRadius: "0 8px 8px 0",
        }}
      >
        <Typography fontWeight={500}>A workspace you can explore.</Typography>
        <Typography variant="body2" color="text.secondary">
          Follow a sprint, open a ticket and see how the demo team moves work
          forward. Changes are shared with other visitors.
        </Typography>
      </Box>
    </Box>
  );
};

export default ProjectContainerView;
