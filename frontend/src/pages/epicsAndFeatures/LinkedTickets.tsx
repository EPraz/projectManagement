import { Box, Button, Chip, Typography } from "@mui/material";
import type { Sprint, Ticket } from "../../types";
import { formatStatusName } from "../../helpers";
export default function LinkedTickets({
  tickets,
  sprints,
  open,
}: {
  tickets: Ticket[];
  sprints: Sprint[];
  open: (id: number) => void;
}) {
  return (
    <Box sx={{ display: "grid", gap: 1.5 }}>
      <Typography component="h3" sx={{ fontSize: 18, fontWeight: 600 }}>
        Linked tickets / {tickets.length}
      </Typography>
      {!tickets.length && (
        <Typography variant="body2" color="text.secondary">
          No linked tickets.
        </Typography>
      )}
      {tickets.map((ticket) => (
        <Box
          key={ticket.id}
          sx={{
            p: 2,
            bgcolor: "background.default",
            borderRadius: "8px",
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="primary">
              TICKET / #{ticket.id}
            </Typography>
            <Chip
              size="small"
              label={formatStatusName(ticket.status?.name ?? "Unclassified")}
            />
          </Box>
          <Button
            onClick={() => open(ticket.id)}
            sx={{
              p: 0,
              my: 1,
              minWidth: 0,
              color: "text.primary",
              fontSize: 16,
              textAlign: "left",
              justifyContent: "flex-start",
              overflowWrap: "anywhere",
            }}
          >
            {ticket.title}
          </Button>
          <Typography variant="body2" color="text.secondary">
            {sprints.find((sprint) => sprint.id === ticket.sprintId)?.name ??
              "Unplanned"}{" "}
            · {ticket.assignedUser?.name ?? "Unassigned"}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
