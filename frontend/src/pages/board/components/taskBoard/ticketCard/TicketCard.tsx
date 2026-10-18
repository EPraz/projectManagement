import { memo } from "react";
import {
  Box,
  ButtonBase,
  Chip,
  IconButton,
  MenuItem,
  Typography,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import type { TicketCardProps } from "../../../../../types";
import { formatStatusName } from "../../../../../helpers";
import EditorSelect from "../../../../../components/workItemEditor/EditorSelect";
function TicketCard({
  ticket,
  onChange,
  ticketStatuses,
  disabled,
}: TicketCardProps) {
  const [params, setParams] = useSearchParams();
  const open = () => {
    const next = new URLSearchParams(params);
    next.set("ticketId", String(ticket.id));
    next.delete("taskId");
    next.delete("ticketTab");
    setParams(next, { replace: true });
  };
  const completed = ticket.tasks.filter(
    (task) => task.status?.name === "DONE",
  ).length;
  return (
    <Box sx={{ minWidth: 0, display: "grid", gap: 1.5 }}>
      <Box
        sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}
      >
        <Typography variant="overline" color="primary">
          #{ticket.id}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatStatusName(ticket.type)}
        </Typography>
        {ticket.isBlocked && (
          <Chip label="Blocked" color="error" size="small" />
        )}
      </Box>
      <ButtonBase
        onClick={open}
        aria-label={`Open ticket #${ticket.id} ${ticket.title}`}
        sx={{
          display: "block",
          width: "100%",
          textAlign: "left",
          borderRadius: 1,
        }}
      >
        <Typography
          component="h3"
          sx={{
            fontSize: 17,
            fontWeight: 600,
            overflowWrap: "anywhere",
            lineHeight: 1.4,
          }}
        >
          {ticket.title}
        </Typography>
      </ButtonBase>
      <EditorSelect
        label={`Ticket state #${ticket.id}`}
        value={ticket.statusId ?? ""}
        onChange={(state) => onChange(ticket.id, state)}
        disabled={disabled || ticket.isBlocked}
      >
        {ticketStatuses?.map((status) => (
          <MenuItem key={status.id} value={status.id}>
            {formatStatusName(status.name)}
          </MenuItem>
        ))}
      </EditorSelect>
      <Typography variant="body2" color="text.secondary">
        {ticket.assignedUser?.name ?? "Unassigned"} · {completed}/
        {ticket.tasks.length} tasks done
      </Typography>
      <Box
        sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}
      >
        <Typography variant="body2" sx={{ flex: 1 }}>
          {formatStatusName(ticket.priority)} priority
        </Typography>
        <IconButton
          size="small"
          sx={{ display: { xs: "none", lg: "inline-flex" } }}
          aria-label="Move ticket up (unavailable)"
          disabled
        >
          <ArrowUpward fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={{ display: { xs: "none", lg: "inline-flex" } }}
          aria-label="Move ticket down (unavailable)"
          disabled
        >
          <ArrowDownward fontSize="small" />
        </IconButton>
      </Box>
      {ticket.dueDate && (
        <Typography variant="body2" color="text.secondary">
          Due{" "}
          {new Date(ticket.dueDate).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </Typography>
      )}
    </Box>
  );
}
export default memo(TicketCard);
