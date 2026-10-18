import { memo } from "react";
import {
  Avatar,
  Box,
  ButtonBase,
  Chip,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import {
  CalendarTodayOutlined,
  ChecklistOutlined,
  FlagOutlined,
} from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import type { TicketCardProps } from "../../../../../types";
import { formatStatusName, getInitials } from "../../../../../helpers";

function TicketCard({
  ticket,
  onChange,
  ticketStatuses,
  disabled,
  leadingAction,
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
  const urgent = ticket.priority === "CRITICAL" || ticket.priority === "HIGH";
  const owner = ticket.assignedUser?.name ?? "Unassigned";
  const due = ticket.dueDate
    ? new Date(ticket.dueDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : null;
  return (
    <Box
      sx={{ minWidth: 0, display: "grid", gap: 1.25, alignContent: "start" }}
    >
      <Box
        sx={{ display: "flex", gap: 0.75, alignItems: "center", minWidth: 0 }}
      >
        {leadingAction}
        <Typography
          variant="body2"
          color="primary.main"
          sx={{ fontWeight: 600, flexShrink: 0 }}
        >
          #{ticket.id}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ lineHeight: 1.4 }}
        >
          {formatStatusName(ticket.type)}
        </Typography>
        {ticket.isBlocked && (
          <Chip
            label="Blocked"
            color="error"
            size="small"
            sx={{ ml: "auto" }}
          />
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
            fontSize: 16,
            fontWeight: 600,
            overflowWrap: "anywhere",
            lineHeight: 1.4,
          }}
        >
          {ticket.title}
        </Typography>
      </ButtonBase>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
        <Select
          size="small"
          value={ticket.statusId ?? ""}
          displayEmpty
          inputProps={{ "aria-label": `Ticket state #${ticket.id}` }}
          onChange={(event) => onChange(ticket.id, event.target.value)}
          disabled={disabled || ticket.isBlocked}
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: 13,
            bgcolor: "background.default",
            "& .MuiSelect-select": { py: 1, pl: 1.25 },
          }}
        >
          {ticketStatuses?.map((status) => (
            <MenuItem key={status.id} value={status.id}>
              {formatStatusName(status.name)}
            </MenuItem>
          ))}
        </Select>
        <Chip
          icon={<FlagOutlined />}
          label={formatStatusName(ticket.priority)}
          aria-label={`${formatStatusName(ticket.priority)} priority`}
          color={urgent ? "error" : "default"}
          variant="outlined"
          size="small"
          sx={{
            borderColor: urgent ? "error.main" : "divider",
            fontSize: 12,
            "& .MuiChip-icon": { fontSize: 15 },
          }}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
        <Avatar
          aria-hidden="true"
          sx={{
            width: 24,
            height: 24,
            fontSize: 11,
            bgcolor: "action.selected",
            color: "primary.main",
          }}
        >
          {getInitials(ticket.assignedUser?.name)}
        </Avatar>
        <Typography
          variant="body2"
          title={owner}
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: 13,
          }}
        >
          {owner}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
          color: "text.secondary",
        }}
      >
        <Typography
          variant="caption"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <ChecklistOutlined sx={{ fontSize: 15 }} />
          {completed}/{ticket.tasks.length} tasks done
        </Typography>
        {due && (
          <Typography
            variant="caption"
            title={`Due ${due}`}
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <CalendarTodayOutlined sx={{ fontSize: 14 }} />
            Due {due}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
export default memo(TicketCard);
