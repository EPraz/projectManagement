import { Avatar, Box, LinearProgress, Typography } from "@mui/material";
import type { Ticket } from "../../../../types";
import OverviewPanel from "../OverviewPanel";
export default function TeamWorkload({ tickets = [] }: { tickets?: Ticket[] }) {
  const groups = new Map<
    string,
    {
      name: string;
      total: number;
      done: number;
      points: number;
      completedPoints: number;
    }
  >();
  tickets.forEach((ticket) => {
    const id = ticket.assignedTo || "unassigned";
    const member = groups.get(id) || {
      name: ticket.assignedUser?.name || "Unassigned",
      total: 0,
      done: 0,
      points: 0,
      completedPoints: 0,
    };
    member.total++;
    member.points += ticket.storyPoints ?? 0;
    if (ticket.status?.name === "COMPLETED") {
      member.done++;
      member.completedPoints += ticket.storyPoints ?? 0;
    }
    groups.set(id, member);
  });
  return (
    <OverviewPanel title="Team workload">
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Ticket assignments in the selected sprint
      </Typography>
      {!groups.size && (
        <Typography variant="body2" color="text.secondary">
          No tickets in this sprint.
        </Typography>
      )}
      {[...groups]
        .sort((a, b) => b[1].total - a[1].total)
        .map(([id, member]) => (
          <Box
            key={id}
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "flex-start",
              py: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: 12,
                bgcolor: "primary.light",
                color: "primary.main",
              }}
            >
              {member.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={500}>
                {member.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {member.done} / {member.total} tickets complete ·{" "}
                {member.completedPoints} / {member.points} story points
              </Typography>
              <LinearProgress
                aria-label={`${member.name} ticket completion`}
                variant="determinate"
                value={(member.done / member.total) * 100}
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
        ))}
    </OverviewPanel>
  );
}
