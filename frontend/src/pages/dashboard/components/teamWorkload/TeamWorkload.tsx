import React from "react";
import { Ticket } from "../../../../types";
import { Avatar, Box, Grid2 as Grid, Typography } from "@mui/material";
import { StyledLinearProgress, TaskCard } from "../../DashBoard.styles";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const TeamWorkload = ({ tickets }: { tickets?: Ticket[] }) => {
  // Group tickets by assignee and calculate workload

  //actualizar despues con ticket in progress / r4qa / r4ba/ done en base al total de tickets
  const teamWorkload = React.useMemo(() => {
    if (!tickets) return [];

    const assigneeMap = new Map();

    tickets.forEach((ticket) => {
      const assigneeId = ticket.assignedTo || "unassigned";
      const assigneeName = ticket.assignedUser?.name || "Unassigned";

      if (!assigneeMap.has(assigneeId)) {
        assigneeMap.set(assigneeId, {
          id: assigneeId,
          name: assigneeName,
          totalTickets: 0,
          completedTickets: 0,
          storyPoints: 0,
          completedStoryPoints: 0,
        });
      }

      const userData = assigneeMap.get(assigneeId);
      userData.totalTickets += 1;
      userData.storyPoints += ticket.storyPoints || 0;

      if (
        ticket.status?.name.toLowerCase() === "done" ||
        ticket.status?.name.toLowerCase() === "completed"
      ) {
        userData.completedTickets += 1;
        userData.completedStoryPoints += ticket.storyPoints || 0;
      }
    });

    return Array.from(assigneeMap.values())
      .filter((user) => user.totalTickets > 0)
      .sort((a, b) => b.totalTickets - a.totalTickets)
      .slice(0, 4);
  }, [tickets]);

  if (teamWorkload.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 3 }}>
        <Typography variant="body2" color="text.secondary">
          No assigned tickets in this sprint
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {teamWorkload.map((user, index) => (
        <Grid size={{ xs: 12, md: 6 }} key={`${user.id}_${index}`}>
          <TaskCard>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <PersonOutlineIcon width={20} height={20} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {user.name}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Progress</span>
                  <span>
                    {user.completedTickets}/{user.totalTickets} tickets
                  </span>
                </Typography>
                <StyledLinearProgress
                  variant="determinate"
                  value={(user.completedTickets / user.totalTickets) * 100}
                  sx={{ mt: 0.5, height: 6, borderRadius: 1 }}
                />
              </Box>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="caption" color="text.secondary">
                Story Points
              </Typography>
              <Typography variant="body2">
                {user.completedStoryPoints}/{user.storyPoints}
              </Typography>
            </Box>
          </TaskCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default TeamWorkload;
