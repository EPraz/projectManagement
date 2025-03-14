import { EmptyState } from "../../ProjectsPage.styles";
import { Button, Tooltip, Typography } from "@mui/material";
import { Add as AddIcon, Folder as FolderIcon } from "@mui/icons-material";
import { ProjectEmptyViewProps } from "../../../../types";

const ProjectEmptyView = ({
  canCreateProject,
  setOpenDialog,
}: ProjectEmptyViewProps) => {
  return (
    <EmptyState>
      <FolderIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        No projects yet
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Create your first project to get started
      </Typography>
      <Tooltip
        title={
          !canCreateProject
            ? "You need ADMIN or PROJECT_MANAGER role to create projects"
            : ""
        }
        arrow
      >
        <span>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            disabled={!canCreateProject}
          >
            Create Project
          </Button>
        </span>
      </Tooltip>
    </EmptyState>
  );
};

export default ProjectEmptyView;
