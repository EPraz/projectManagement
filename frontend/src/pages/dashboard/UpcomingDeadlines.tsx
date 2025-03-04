import { Avatar, Box, Grid2 as Grid, Typography } from "@mui/material";
import { Sprint } from "../../types";
import { TaskCard } from "./DashBoard.styles";
import ScheduleIcon from "@mui/icons-material/Schedule";

const UpcomingDeadlines = ({ sprint }: { sprint?: Sprint | null }) => {
  // Sort tickets by due date (closest first)
  const upcomingTickets =
    sprint?.tickets
      ?.filter(
        (ticket) => ticket.dueDate && new Date(ticket.dueDate) > new Date()
      )
      .sort(
        (a, b) =>
          new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
      )
      .slice(0, 4) || [];

  if (upcomingTickets.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 3 }}>
        <Typography variant="body2" color="text.secondary">
          No upcoming deadlines
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {upcomingTickets.map((ticket, index) => (
        <Grid size={{ xs: 12, md: 6 }} key={`${ticket.id}_${index}`}>
          <TaskCard>
            <Avatar sx={{ bgcolor: "warning.main" }}>
              <ScheduleIcon width={20} height={20} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {ticket.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {ticket.assignedUser?.name || "Unassigned"}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="caption" color="text.secondary">
                Due Date
              </Typography>
              <Typography
                variant="body2"
                color={
                  new Date(ticket.dueDate!) <
                  new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
                    ? "error.main"
                    : "text.primary"
                }
              >
                {new Date(ticket.dueDate!).toLocaleDateString()}
              </Typography>
            </Box>
          </TaskCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default UpcomingDeadlines;
