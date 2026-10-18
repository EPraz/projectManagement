import { Box, Typography, useTheme } from "@mui/material";
import type { Ticket, TicketStatus } from "../../../../types";
import { formatStatusName } from "../../../../helpers";
import OverviewPanel from "../OverviewPanel";
export default function SprintMetricsChart({
  tickets,
  statuses,
}: {
  tickets: Ticket[];
  statuses: TicketStatus[];
}) {
  const theme = useTheme();
  const groups = [...statuses]
    .sort((a, b) => a.position - b.position)
    .map((status) => ({
      ...status,
      count: tickets.filter((ticket) => ticket.statusId === status.id).length,
    }));
  const unclassified = tickets.filter(
    (ticket) => !statuses.some((status) => status.id === ticket.statusId),
  ).length;
  if (unclassified)
    groups.push({
      id: "unclassified",
      name: "Unclassified",
      position: groups.length,
      color: theme.palette.text.secondary,
      count: unclassified,
    });
  let offset = 0;
  const segments = groups
    .filter((group) => group.count)
    .map((group) => {
      const start = offset;
      offset += (group.count / tickets.length) * 100;
      return `${group.color || theme.palette.primary.main} ${start}% ${offset}%`;
    });
  return (
    <OverviewPanel title="Ticket states">
      <Box
        role="img"
        aria-label={`Selected sprint ticket states: ${groups.map((group) => `${formatStatusName(group.name)} ${group.count}`).join(", ")}`}
        sx={{
          width: 150,
          height: 150,
          mx: "auto",
          my: 3,
          borderRadius: "50%",
          background: segments.length
            ? `conic-gradient(${segments.join(",")})`
            : theme.palette.divider,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Box
          sx={{
            width: 124,
            height: 124,
            borderRadius: "50%",
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontSize: 30, fontWeight: 500 }}>
            {tickets.length}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            sprint tickets
          </Typography>
        </Box>
      </Box>
      {!tickets.length && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No tickets in this sprint.
        </Typography>
      )}
      <Box
        component="ul"
        sx={{
          m: 0,
          p: 0,
          listStyle: "none",
          display: "grid",
          gridTemplateColumns: "repeat(2,minmax(0,1fr))",
          gap: 1.5,
        }}
      >
        {groups.map((group) => (
          <Box
            component="li"
            key={group.id}
            sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                flexShrink: 0,
                borderRadius: "50%",
                bgcolor: group.color || "primary.main",
                border: "1px solid",
                borderColor: "text.secondary",
              }}
            />
            <Typography
              variant="caption"
              sx={{ flex: 1, overflowWrap: "anywhere" }}
            >
              {formatStatusName(group.name)}
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {group.count}
            </Typography>
          </Box>
        ))}
      </Box>
    </OverviewPanel>
  );
}
