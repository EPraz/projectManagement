import { Box, Button, Divider, Tooltip, Typography } from "@mui/material";
import { GridViewOutlined } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { currentSection, projectSections } from "./sections";
export default function ProjectNavigation({
  projectId,
  compact = false,
  onNavigate,
}: {
  projectId: string;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const active = currentSection(location.pathname, location.search);
  const go = (path: string) => {
    onNavigate?.();
    if (location.pathname + (location.search || "") !== path) navigate(path);
  };
  return (
    <Box
      component="nav"
      aria-label="Project sections"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        width: "100%",
        p: compact ? 1 : 2,
      }}
    >
      <Tooltip title={compact ? "All projects" : ""} placement="right">
        <Button
          aria-label="All projects"
          onClick={() => go("/projects")}
          sx={{
            minWidth: 0,
            justifyContent: compact ? "center" : "flex-start",
            color: "inherit",
            gap: 1.5,
          }}
        >
          <GridViewOutlined />
          {!compact && "All projects"}
        </Button>
      </Tooltip>
      <Divider
        sx={{ my: 1, borderColor: compact ? "sidebar.border" : "divider" }}
      />
      {projectSections.map((section, index) => {
        const Icon = section.icon;
        return (
          <Box key={section.path}>
            {!compact &&
              (index === 0 ||
                section.group !== projectSections[index - 1].group) && (
                <Typography
                  variant="overline"
                  color="text.secondary"
                  sx={{ display: "block", mt: 1, px: 1 }}
                >
                  {section.group}
                </Typography>
              )}
            <Tooltip title={compact ? section.label : ""} placement="right">
              <Button
                aria-label={section.label}
                aria-current={active.path === section.path ? "page" : undefined}
                onClick={() => go(`/projects/${projectId}/${section.path}`)}
                sx={{
                  width: "100%",
                  minWidth: 0,
                  justifyContent: compact ? "center" : "flex-start",
                  gap: 1.5,
                  color: compact ? "#b8cfff" : "text.primary",
                  borderRadius: "8px",
                  bgcolor:
                    active.path === section.path
                      ? compact
                        ? "sidebar.active"
                        : "primary.light"
                      : "transparent",
                  borderLeft:
                    active.path === section.path
                      ? "2px solid"
                      : "2px solid transparent",
                  borderColor:
                    active.path === section.path
                      ? "primary.main"
                      : "transparent",
                  "&:hover": {
                    bgcolor: compact ? "sidebar.hover" : "action.hover",
                  },
                }}
              >
                <Icon sx={{ fontSize: 21 }} />
                {!compact && section.label}
              </Button>
            </Tooltip>
          </Box>
        );
      })}
    </Box>
  );
}
