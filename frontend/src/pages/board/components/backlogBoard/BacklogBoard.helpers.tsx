import { Box, Button, Chip, IconButton } from "@mui/material";
import { EditOutlined, DeleteOutline } from "@mui/icons-material";
import type { Ticket } from "../../../../types";
import { formatStatusName, getTypeIcon } from "../../../../helpers";
export const renderCellContent = (
  key: string,
  ticket: Ticket,
  open: (ticket: Ticket) => void,
  remove: (ticket: Ticket) => void,
  sprintName?: string,
) => {
  switch (key) {
    case "order":
      return ticket.order;
    case "id":
      return `#${ticket.id}`;
    case "title":
      return (
        <Button
          aria-label={ticket.title}
          onClick={() => open(ticket)}
          sx={{
            minWidth: 0,
            p: 0,
            color: "text.primary",
            fontSize: 16,
            textAlign: "left",
            justifyContent: "flex-start",
            overflowWrap: "anywhere",
            lineHeight: 1.5,
          }}
        >
          {ticket.title}
        </Button>
      );
    case "state":
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            component="span"
            aria-hidden
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              flexShrink: 0,
              bgcolor: ticket.status?.color ?? "text.secondary",
            }}
          />
          {formatStatusName(ticket.status?.name ?? "Unclassified")}
        </Box>
      );
    case "priority":
      return formatStatusName(ticket.priority);
    case "type":
      return (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {getTypeIcon(ticket.type)}
          {formatStatusName(ticket.type)}
        </Box>
      );
    case "assignedTo":
      return ticket.assignedUser?.name ?? "Unassigned";
    case "sprint":
      return sprintName ?? ticket.sprint?.name ?? "Unplanned";
    case "dueDate":
      return ticket.dueDate
        ? new Date(ticket.dueDate).toLocaleDateString()
        : "No due date";
    case "estimatedHours":
      return ticket.estimatedHours ?? "—";
    case "remainingHours":
      return ticket.remainingHours ?? "—";
    case "isBlocked":
      return (
        <Chip
          size="small"
          color={
            ticket.isBlocked || ticket.status?.name === "BLOCKED"
              ? "error"
              : "default"
          }
          label={
            ticket.isBlocked || ticket.status?.name === "BLOCKED"
              ? "Blocked"
              : "Clear"
          }
        />
      );
    case "tags":
      return (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {ticket.tags?.map((tag) => (
            <Chip key={tag.id} label={tag.name} size="small" />
          ))}
        </Box>
      );
    case "actions":
      return (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton
            aria-label={`Edit ticket ${ticket.id}`}
            onClick={() => open(ticket)}
          >
            <EditOutlined fontSize="small" />
          </IconButton>
          <IconButton
            aria-label={`Delete ticket ${ticket.id}`}
            color="error"
            onClick={() => remove(ticket)}
          >
            <DeleteOutline fontSize="small" />
          </IconButton>
        </Box>
      );
    default:
      return null;
  }
};
