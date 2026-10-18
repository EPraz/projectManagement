import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Close, Menu, Refresh, ChevronRight } from "@mui/icons-material";
import type { HeaderProps } from "../../types";
import AppearanceControl from "../appearanceControl/AppearanceControl";
import UserMenu from "./userMenu/UserMenu";
import ProjectNavigation from "../projectNavigation/ProjectNavigation";
import { currentSection } from "../projectNavigation/sections";
export default function Header({
  projectName,
  projectId,
  onRefresh,
  refreshing = false,
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const section = currentSection(location.pathname, location.search);
  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
        pb: 3,
        minWidth: 0,
      }}
    >
      <IconButton
        aria-label="Open project navigation"
        onClick={() => setOpen(true)}
        sx={{ display: { md: "none" } }}
      >
        <Menu />
      </IconButton>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          minWidth: 0,
          flex: 1,
          gap: 0.5,
        }}
      >
        <Button
          aria-label="Back to projects"
          onClick={() => navigate("/projects")}
          sx={{
            display: { xs: "none", sm: "inline-flex" },
            color: "text.secondary",
            px: 0.5,
          }}
        >
          Projects
        </Button>
        <ChevronRight
          sx={{
            display: { xs: "none", sm: "block" },
            color: "text.secondary",
            fontSize: 16,
          }}
        />
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: { xs: 130, sm: 280 },
          }}
        >
          {projectName}
        </Typography>
        <ChevronRight
          sx={{
            display: { xs: "none", sm: "block" },
            color: "text.secondary",
            fontSize: 16,
          }}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          {section.label}
        </Typography>
      </Box>
      <Chip
        variant="outlined"
        size="small"
        label="Demo workspace"
        sx={{ display: { xs: "none", lg: "flex" } }}
      />
      {onRefresh && (
        <Tooltip title="Refresh project">
          <span>
            <IconButton
              aria-label="Refresh project"
              onClick={onRefresh}
              disabled={refreshing}
            >
              <Refresh fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      )}
      <AppearanceControl />
      <UserMenu />
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: "min(300px, 90vw)", p: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1,
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
        </Box>
      </Drawer>
    </Box>
  );
}
