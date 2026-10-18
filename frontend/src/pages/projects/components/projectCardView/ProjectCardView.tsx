import { Link } from "react-router-dom";
import { Box, Button, IconButton, Typography } from "@mui/material";
import {
  ArrowForward,
  MoreHoriz,
  FormatListBulleted,
  Done,
  GroupOutlined,
} from "@mui/icons-material";
import type { ProjectCardViewProps } from "../../../../types";
import { getProjectProgress } from "../../../../helpers";
import AvatarGroupsComponent from "../avatarGroup/AvatarGroups";
import ProgressRing from "../../../../components/studio/ProgressRing";
export default function ProjectCardView({
  project,
  handleMenuClick,
  allTickets,
}: ProjectCardViewProps) {
  const done = allTickets.filter(
    (ticket) =>
      project.ticketStatuses.find((status) => status.id === ticket.statusId)
        ?.name === "COMPLETED",
  ).length;
  const progress = getProjectProgress(project.ticketStatuses, allTickets);
  const metrics = [
    { label: "Tickets", count: allTickets.length, Icon: FormatListBulleted },
    { label: "Done", count: done, Icon: Done },
    { label: "Members", count: project.users.length, Icon: GroupOutlined },
  ];
  return (
    <>
      <Typography
        component="p"
        variant="overline"
        color="text.secondary"
        sx={{ mb: 3, pr: 5 }}
      >
        {project.sprints.length} sprints / Project
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          mb: 3,
          minWidth: 0,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            component="h2"
            variant="h2"
            sx={{ overflowWrap: "anywhere" }}
          >
            <Link to={`/projects/${project.id}/overview`}>{project.title}</Link>
          </Typography>
        </Box>
        <ProgressRing value={progress} label="Project progress" />
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 3,
          minHeight: 45,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          overflowWrap: "anywhere",
        }}
      >
        {project.description || "No description available"}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(96px,1fr))",
          borderBlock: "1px solid",
          borderColor: "divider",
          py: 2,
          gap: 1,
        }}
      >
        {metrics.map(({ label, count, Icon }) => (
          <Box
            key={label}
            sx={{
              display: "flex",
              gap: 0.75,
              alignItems: "center",
              minWidth: 0,
            }}
          >
            <Icon
              sx={{
                color: label === "Done" ? "success.main" : "primary.main",
                flexShrink: 0,
                fontSize: 20,
              }}
            />
            <Typography component="span" sx={{ fontWeight: 500, fontSize: 18 }}>
              {count}
            </Typography>
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", gap: 1, mt: 2 }}
      >
        <Typography variant="caption" color="text.secondary">
          Project progress
        </Typography>
        <Typography variant="caption">
          {done} / {allTickets.length} tickets done
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          mt: 2,
        }}
      >
        <AvatarGroupsComponent max={4} projectUsers={project.users} />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            component={Link}
            to={`/projects/${project.id}/overview`}
            aria-label={`Open project ${project.title}`}
            endIcon={<ArrowForward fontSize="small" />}
          >
            Open project
          </Button>
          <IconButton
            aria-label={`Project actions for ${project.title}`}
            onClick={(event) => handleMenuClick(event, project.id)}
          >
            <MoreHoriz />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}
