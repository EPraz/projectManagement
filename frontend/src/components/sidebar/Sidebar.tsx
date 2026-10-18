import { Box } from "@mui/material";
import type { SidebarProps } from "../../types";
import StudioMark from "../studio/StudioMark";
import ProjectNavigation from "../projectNavigation/ProjectNavigation";
export default function Sidebar({ project }: SidebarProps) {
  return (
    <Box
      component="aside"
      aria-label={`${project.title} navigation`}
      sx={{
        display: { xs: "none", md: "flex" },
        position: "fixed",
        zIndex: 10,
        top: 22,
        left: 22,
        bottom: 22,
        width: 74,
        borderRadius: "19px",
        bgcolor: "sidebar.background",
        color: "#91b8ff",
        alignItems: "center",
        flexDirection: "column",
        overflowY: "auto",
        py: 3,
      }}
    >
      <StudioMark />
      <Box sx={{ mt: 3, width: "100%" }}>
        <ProjectNavigation projectId={project.id} compact />
      </Box>
    </Box>
  );
}
