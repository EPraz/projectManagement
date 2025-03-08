import { ProjectContainerViewProps } from "../../types";
import { Loading } from "..";
import ProjectHeader from "./ProjectHeader";
import { Container } from "@mui/material";
import ProjectEmptyView from "./ProjectEmptyView";
import ProjectGridView from "./ProjectGridView";
import ProjectListView from "./ProjectListView";

const ProjectContainerView = ({
  projects,
  loading,
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
  if (loading) return <Loading />;

  return (
    <Container>
      <ProjectHeader
        searchInput={searchInput}
        handleSearchChange={handleSearchChange}
        handleViewChange={handleViewChange}
        view={view}
        canCreateProject={canCreateProject}
        setOpenDialog={setOpenDialog}
      />
      {projects.length === 0 ? (
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
    </Container>
  );
};

export default ProjectContainerView;
