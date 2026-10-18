import { Box, Card, Divider, LinearProgress, Typography } from "@mui/material";
import type { Project, Sprint, Ticket } from "../../../types";
import { getProjectProgress } from "../../../helpers/projectsPage/ProjectsPage.helper";
import { getBlockedTickets } from "../overviewMetrics";
import { getDaysRemaining } from "../DashBoard.helpers";
export default function SprintExecution({
  project,
  sprint,
  tickets,
}: {
  project: Project;
  sprint: Sprint | null;
  tickets: Ticket[];
}) {
  const completion = getProjectProgress(project.ticketStatuses, tickets);
  const done = tickets.filter(
    (ticket) =>
      project.ticketStatuses.find((status) => status.id === ticket.statusId)
        ?.name === "COMPLETED",
  ).length;
  const tasks = tickets.flatMap((ticket) => ticket.tasks);
  const taskRemaining = tasks.reduce(
    (sum, task) => sum + (task.remainingHours ?? 0),
    0,
  );
  const completedPoints = tickets
    .filter((ticket) => ticket.status?.name === "COMPLETED")
    .reduce((sum, ticket) => sum + (ticket.storyPoints ?? 0), 0);
  const points = tickets.reduce(
    (sum, ticket) => sum + (ticket.storyPoints ?? 0),
    0,
  );
  const estimated = tickets.reduce(
    (sum, ticket) => sum + (ticket.estimatedHours ?? 0),
    0,
  );
  const remaining = tickets.reduce(
    (sum, ticket) => sum + (ticket.remainingHours ?? 0),
    0,
  );
  return (
    <Card
      component="section"
      aria-label="Selected sprint execution"
      sx={{ p: { xs: 2, sm: 3 }, minWidth: 0, height: "100%" }}
    >
      <Typography variant="overline" color="primary">
        Selected sprint
      </Typography>
      <Typography component="h2" variant="h3">
        {sprint?.name || "No sprint selected"}
      </Typography>
      {!sprint ? (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Create or select a sprint to see its execution summary.
        </Typography>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2,minmax(0,1fr))",
                sm: "repeat(4,minmax(0,1fr))",
              },
              gap: 2,
              my: 3,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 44,
                  lineHeight: 1.2,
                  color: "primary.main",
                  fontWeight: 500,
                }}
              >
                {done}
                <Box
                  component="span"
                  sx={{ fontSize: 24, color: "text.secondary" }}
                >
                  {" "}
                  / {tickets.length}
                </Box>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tickets done
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 30, fontWeight: 500 }}>
                {completion}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Completion
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 30, fontWeight: 500 }}>
                {taskRemaining}
                <Box component="span" sx={{ fontSize: 15 }}>
                  {" "}
                  h
                </Box>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Task hours remaining
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: 30, fontWeight: 500, color: "error.main" }}
              >
                {getBlockedTickets(tickets).length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Blocked tickets
              </Typography>
            </Box>
          </Box>
          <LinearProgress
            aria-label="Sprint completion"
            variant="determinate"
            value={completion}
            sx={{ height: 7, mb: 2 }}
          />
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "space-between",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {tickets.length} Total Tickets
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {getDaysRemaining(sprint.endDate)} · Time remaining
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {
                sprint.sprintGoal.filter(
                  (goal) => goal.goalsStatus === "COMPLETED",
                ).length
              }{" "}
              of {sprint.sprintGoal.length} sprint goals complete
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="body2">
              Story Points: {completedPoints} / {points}
            </Typography>
            <Typography variant="body2">
              Ticket hours remaining: {remaining} / {estimated} h
            </Typography>
          </Box>
        </>
      )}
    </Card>
  );
}
