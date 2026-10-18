import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import type { ProjectMenuProps } from "../../../../types";
import DeleteConfirmationModal from "../../../../components/deleteConfirmationModal/DeleteConfirmationModal";
export default function ProjectMenu({
  anchorEl,
  handleMenuClose,
  asPermission,
  loading,
  handleDeleteProject,
  selectedProjectId,
  projectTitle,
}: ProjectMenuProps) {
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && !confirm}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => setConfirm(true)}
          disabled={!asPermission || loading}
          sx={{ color: "error.main" }}
        >
          Delete Project
        </MenuItem>
      </Menu>
      <DeleteConfirmationModal
        open={confirm}
        onClose={handleMenuClose}
        itemName={projectTitle}
        itemKey={selectedProjectId ?? ""}
        disabled={loading}
        onConfirm={() =>
          selectedProjectId
            ? handleDeleteProject({ id: selectedProjectId })
            : Promise.resolve(false)
        }
      />
    </>
  );
}
