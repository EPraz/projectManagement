import { Menu, MenuItem } from "@mui/material";
import { ProjectMenuProps } from "../../../../types";

const ProjectMenu = ({
  anchorEl,
  handleMenuClose,
  asPermission,
  loading,
  handleDeleteProject,
  selectedProjectId,
}: ProjectMenuProps) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      elevation={3}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <MenuItem onClick={handleMenuClose} disabled={true}>
        Edit Project
      </MenuItem>
      <MenuItem onClick={handleMenuClose} disabled={true}>
        Manage Team
      </MenuItem>
      <MenuItem onClick={handleMenuClose} disabled={true}>
        Project Settings
      </MenuItem>
      <MenuItem
        onClick={() => {
          if (selectedProjectId) {
            handleDeleteProject({ id: selectedProjectId });
          }
        }}
        disabled={!asPermission || loading}
        sx={{ color: "error.main" }}
      >
        Delete Project
      </MenuItem>
    </Menu>
  );
};

export default ProjectMenu;
