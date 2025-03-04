import React from "react";
import { Box, Typography, Paper, Tooltip } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Sprint, Ticket, TicketStatus } from "../../types";
import { formatStatusName } from "../../helpers";

// Fallback colors in case status doesn't have a color
const FALLBACK_COLORS = [
  "#2196f3", // Blue
  "#4caf50", // Green
  "#ff9800", // Orange
  "#f44336", // Red
  "#9c27b0", // Purple
  "#00bcd4", // Cyan
];

interface SprintMetricsChartProps {
  sprint: Sprint | null;
}

const SprintMetricsChart: React.FC<SprintMetricsChartProps> = ({ sprint }) => {
  if (!sprint?.tickets || sprint.tickets.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: "background.paper",
          width: "100%",
        }}
      >
        <Typography variant="subtitle1" fontWeight="medium" align="left">
          Sprint Progress
        </Typography>
        <Box
          sx={{
            height: 200,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign={"center"}
          >
            No tickets in this sprint
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Group tickets by status
  const statusGroups: Record<
    string,
    { status: TicketStatus; tickets: Ticket[] }
  > = sprint.tickets.reduce((acc, ticket) => {
    if (!ticket.status) return acc;

    const statusId = ticket.status.id;
    if (!acc[statusId]) {
      acc[statusId] = {
        status: ticket.status,
        tickets: [],
      };
    }
    acc[statusId].tickets.push(ticket);
    return acc;
  }, {} as Record<string, { status: TicketStatus; tickets: Ticket[] }>);

  // Create data for the pie chart
  const statusData = Object.values(statusGroups)
    .sort((a, b) => a.status.position - b.status.position) // Sort by position
    .map((group, index) => ({
      name: group.status.name,
      value: group.tickets.length,
      color:
        group.status.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length],
    }));

  // Calculate blocked tickets
  const blockedCount = sprint.tickets.filter(
    (ticket) => ticket.isBlocked
  ).length;

  // Calculate completion metrics
  const totalTickets = sprint.tickets.length;

  // Find the "Done" status (assuming it has a name like "Done", "Completed", etc.)
  const doneStatusIds = Object.values(statusGroups)
    .filter(
      (group) =>
        group.status.name.toLowerCase() === "done" ||
        group.status.name.toLowerCase() === "completed"
    )
    .map((group) => group.status.id);

  const completedTickets = sprint.tickets.filter(
    (ticket) => ticket.status && doneStatusIds.includes(ticket.status.id)
  ).length;

  const completionPercentage =
    totalTickets > 0 ? Math.round((completedTickets / totalTickets) * 100) : 0;

  // Calculate story points
  const totalStoryPoints = sprint.tickets.reduce(
    (sum, ticket) => sum + (ticket.storyPoints || 0),
    0
  );

  const completedStoryPoints = sprint.tickets
    .filter(
      (ticket) => ticket.status && doneStatusIds.includes(ticket.status.id)
    )
    .reduce((sum, ticket) => sum + (ticket.storyPoints || 0), 0);

  // Calculate estimated vs remaining hours
  const totalEstimatedHours = sprint.tickets.reduce(
    (sum, ticket) => sum + (ticket.estimatedHours || 0),
    0
  );
  const totalRemainingHours = sprint.tickets.reduce(
    (sum, ticket) => sum + (ticket.remainingHours || 0),
    0
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        elevation={0}
        sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper" }}
      >
        <Typography variant="subtitle1" fontWeight="medium" mb={1}>
          Sprint Progress
        </Typography>

        <Box sx={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) =>
                  `${formatStatusName(name)} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
                fontSize={12}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Tooltip title="Total number of tickets in this sprint">
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5" fontWeight="bold">
                {totalTickets}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Tickets
              </Typography>
            </Box>
          </Tooltip>

          <Tooltip title="Percentage of completed tickets">
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5" fontWeight="bold">
                {completionPercentage}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Completion
              </Typography>
            </Box>
          </Tooltip>

          <Tooltip title="Number of blocked tickets">
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={blockedCount > 0 ? "error.main" : "inherit"}
              >
                {blockedCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Blocked
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{ p: 2, mt: 2, borderRadius: 2, bgcolor: "background.paper" }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Tooltip title="Total story points in this sprint">
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5" fontWeight="bold">
                {completedStoryPoints}/{totalStoryPoints}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Story Points
              </Typography>
            </Box>
          </Tooltip>

          <Tooltip title="Estimated hours remaining">
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5" fontWeight="bold">
                {totalRemainingHours}/{totalEstimatedHours}h
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Hours Remaining
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      </Paper>
    </Box>
  );
};

export default SprintMetricsChart;
