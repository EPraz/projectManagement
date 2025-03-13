import { ProjectCardViewProps } from "../../../types";
import { Box, IconButton, LinearProgress, Typography } from "@mui/material";
import { MetricBox } from "./ProjectsPage.styles";
import {
  MoreVert as MoreVertIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";
import { getProjectProgress } from "../../../helpers";
import AvatarGroupsComponent from "./AvatarGroups";

const ProjectCardView = ({
  project,
  handleMenuClick,
  allTickets,
}: ProjectCardViewProps) => {
  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {project.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {project.description || "No description available"}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Progress
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LinearProgress
              variant="determinate"
              value={getProjectProgress(project.ticketStatuses, allTickets)}
              sx={{ flex: 1, height: 6, borderRadius: 3 }}
            />
            <Typography variant="caption" color="text.secondary">
              {getProjectProgress(project.ticketStatuses, allTickets)}%
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <MetricBox>
          <AssignmentIcon className="icon" fontSize="small" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Tickets
            </Typography>
            <Typography variant="subtitle2">
              {allTickets?.length || 0}
            </Typography>
          </Box>
        </MetricBox>

        <MetricBox>
          <SpeedIcon className="icon" fontSize="small" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Sprints
            </Typography>
            <Typography variant="subtitle2">
              {project.sprints?.length || 0}
            </Typography>
          </Box>
        </MetricBox>

        <MetricBox>
          <GroupIcon className="icon" fontSize="small" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Team
            </Typography>
            <Typography variant="subtitle2">
              {project.users?.length || 0}
            </Typography>
          </Box>
        </MetricBox>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <AvatarGroupsComponent max={4} projectUsers={project.users} />
        <IconButton
          size="small"
          onClick={(e) => handleMenuClick(e, project.id)}
        >
          <MoreVertIcon />
        </IconButton>
      </Box>
    </>
  );
};

export default ProjectCardView;
