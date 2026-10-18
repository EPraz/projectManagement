import { useState } from "react";
import { Box, Button, Drawer, IconButton, Typography } from "@mui/material";
import { Close, GridViewOutlined, Menu } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { HeaderProps } from "../../types";
import ProjectNavigation from "../projectNavigation/ProjectNavigation";
import WorkspaceActions from "../studio/WorkspaceActions";

// Only the compact mobile navigation entry remains; desktop starts with page content.
export default function Header({
  projectName = "Projects",
  projectId,
  onRefresh,
  refreshing = false,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <Box
      component="header"
      sx={{
        display: { xs: "flex", md: "none" },
        alignItems: "center",
        gap: 1,
        minWidth: 0,
        mb: 1,
      }}
    >
      <IconButton
        aria-label={
          projectId ? "Open project navigation" : "Open workspace navigation"
        }
        onClick={() => setOpen(true)}
      >
        <Menu />
      </IconButton>
      <Typography
        variant="body2"
        color="text.secondary"
        noWrap
        sx={{ minWidth: 0 }}
      >
        {projectName}
      </Typography>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: "min(300px, 90vw)",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            flexShrink: 0,
          }}
        >
          <Typography fontWeight={600}>EPProject Management</Typography>
          <IconButton
            aria-label="Close project navigation"
            onClick={() => setOpen(false)}
          >
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {projectId ? (
            <>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ px: 2, overflowWrap: "anywhere" }}
              >
                {projectName}
              </Typography>
              <ProjectNavigation
                projectId={projectId}
                onNavigate={() => setOpen(false)}
              />
            </>
          ) : (
            <Button
              startIcon={<GridViewOutlined />}
              sx={{ m: 2 }}
              onClick={() => {
                setOpen(false);
                navigate("/projects");
              }}
            >
              All projects
            </Button>
          )}
        </Box>
        <Box sx={{ p: 2, flexShrink: 0, borderTop: 1, borderColor: "divider" }}>
          <WorkspaceActions onRefresh={onRefresh} refreshing={refreshing} />
        </Box>
      </Drawer>
    </Box>
  );
}
