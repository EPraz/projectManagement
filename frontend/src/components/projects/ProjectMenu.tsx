import { Menu, MenuItem } from "@mui/material";
import { ProjectMenuProps } from "../../types";

const ProjectMenu = ({ anchorEl, handleMenuClose }: ProjectMenuProps) => {
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
      <MenuItem onClick={handleMenuClose}>Edit Project</MenuItem>
      <MenuItem onClick={handleMenuClose}>Manage Team</MenuItem>
      <MenuItem onClick={handleMenuClose}>Project Settings</MenuItem>
      <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
        Delete Project
      </MenuItem>
    </Menu>
  );
};

export default ProjectMenu;
