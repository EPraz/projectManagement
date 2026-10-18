import { Avatar, Box, Card, Divider, Typography } from "@mui/material";
import type { Project, Ticket } from "../../../types";
import { getProjectProgress } from "../../../helpers/projectsPage/ProjectsPage.helper";
import ProgressRing from "../../../components/studio/ProgressRing";
import AvatarGroups from "../../projects/components/avatarGroup/AvatarGroups";
export default function ProjectProfile({
  project,
  tickets,
}: {
  project: Project;
  tickets: Ticket[];
}) {
  const done = tickets.filter(
    (ticket) =>
      project.ticketStatuses.find((status) => status.id === ticket.statusId)
        ?.name === "COMPLETED",
  ).length;
  return (
    <Card
      component="section"
      aria-label="Project profile"
      sx={{
        position: "relative",
        p: 3,
        height: "100%",
        minWidth: 0,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 24,
          right: 24,
          height: 3,
          bgcolor: "primary.main",
        },
      }}
    >
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
        <Avatar
          variant="rounded"
          sx={{
            width: 56,
            height: 56,
            bgcolor: "primary.light",
            color: "primary.main",
            border: "1px solid",
            borderColor: "divider",
            fontSize: 25,
          }}
        >
          {project.title.charAt(0)}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline" color="primary">
            {project.type || "Project workspace"}
          </Typography>
          <Typography
            component="h2"
            variant="h2"
            sx={{ overflowWrap: "anywhere" }}
          >
            {project.title}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {project.description || "No project description yet."}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
          my: 4,
        }}
      >
        <ProgressRing
          value={getProjectProgress(project.ticketStatuses, tickets)}
          label="Overall Progress"
          size={150}
        />
        <Box sx={{ textAlign: "center" }}>
          <Typography fontWeight={500}>
            {done} of {tickets.length} tickets done
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Across the whole project
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
            Overall Progress
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2,minmax(0,1fr))",
          gap: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          pt: 2,
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary">
            Started
          </Typography>
          <Typography variant="body2">
            {Number.isFinite(Date.parse(project.createdAt))
              ? new Date(project.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Not recorded"}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Project scope
          </Typography>
          <Typography variant="body2">
            {tickets.length} tickets · {project.sprints.length} sprints
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "space-between",
        }}
      >
        <AvatarGroups max={4} projectUsers={project.users} />
        <Typography variant="caption" color="text.secondary">
          {project.users.length} team members
        </Typography>
      </Box>
    </Card>
  );
}
