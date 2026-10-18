import {
  Box,
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import type { Ticket, TicketStatus, User } from "../../types";
import { TicketPriority, TicketType } from "../../constants";
import { formatStatusName } from "../../helpers";
import EditorSelect from "../workItemEditor/EditorSelect";
import type { TicketFieldProps } from "./types";
export default function TicketDetailsFields({
  draft,
  errors,
  disabled,
  change,
  statuses = [],
  users = [],
  tickets = [],
  creating,
}: TicketFieldProps & {
  statuses?: TicketStatus[];
  users?: User[];
  tickets?: Ticket[];
  creating: boolean;
}) {
  const blocked = Boolean(draft.isBlocked);
  const toggleBlocked = () => {
    const value = !blocked;
    change({
      isBlocked: value,
      statusId: creating
        ? draft.statusId
        : value
          ? statuses.find((status) => status.name === "BLOCKED")?.id ||
            draft.statusId
          : "",
      blockedBy: value ? draft.blockedBy : null,
    });
  };
  return (
    <Box sx={{ display: "grid", gap: 3 }}>
      <TextField
        label="Title"
        placeholder="Ticket title"
        name="title"
        value={draft.title ?? ""}
        onChange={(event) => change({ title: event.target.value })}
        required
        fullWidth
        disabled={disabled}
        error={Boolean(errors.title)}
        helperText={errors.title}
        autoFocus
      />
      <TextField
        label="Description"
        placeholder="Add a more detailed description..."
        value={draft.description ?? ""}
        onChange={(event) => change({ description: event.target.value })}
        fullWidth
        multiline
        rows={4}
        disabled={disabled}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0,1fr)",
            sm: "repeat(2,minmax(0,1fr))",
          },
          gap: 2,
        }}
      >
        <EditorSelect
          label="Ticket state"
          value={draft.statusId ?? ""}
          onChange={(statusId) => change({ statusId })}
          disabled={disabled || blocked || creating}
          error={errors.statusId}
          testId="status-select"
        >
          <MenuItem value="">
            <em>Choose a state</em>
          </MenuItem>
          {statuses.map((status) => (
            <MenuItem key={status.id} value={status.id}>
              {formatStatusName(status.name)}
            </MenuItem>
          ))}
        </EditorSelect>
        <EditorSelect
          label="Type"
          value={draft.type ?? ""}
          onChange={(value) => change({ type: value as TicketType })}
          disabled={disabled}
          error={errors.type}
        >
          {Object.values(TicketType).map((type) => (
            <MenuItem key={type} value={type}>
              {formatStatusName(type)}
            </MenuItem>
          ))}
        </EditorSelect>
        <EditorSelect
          label="Assigned To"
          value={draft.assignedTo ?? ""}
          onChange={(assignedTo) => change({ assignedTo })}
          disabled={disabled}
        >
          <MenuItem value="">
            <em>Unassigned</em>
          </MenuItem>
          {draft.assignedTo &&
            !users.some((user) => user.id === draft.assignedTo) && (
              <MenuItem value={draft.assignedTo} disabled>
                {draft.assignedUser?.name ?? "Assigned person"} · Outside
                project team
              </MenuItem>
            )}
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </EditorSelect>
        <EditorSelect
          label="Priority"
          value={draft.priority ?? ""}
          onChange={(value) => change({ priority: value as TicketPriority })}
          disabled={disabled}
          error={errors.priority}
        >
          {Object.values(TicketPriority).map((priority) => (
            <MenuItem key={priority} value={priority}>
              {formatStatusName(priority)}
            </MenuItem>
          ))}
        </EditorSelect>
      </Box>
      {creating && (
        <Typography variant="body2" color="text.secondary">
          New tickets start in New. Their task states remain independent.
        </Typography>
      )}
      <Box
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: blocked ? "error.main" : "divider",
          borderRadius: "8px",
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={blocked}
              onChange={toggleBlocked}
              disabled={disabled}
            />
          }
          label="Blocked"
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: blocked ? 2 : 0 }}
        >
          Flag an impediment separately from the ticket's child tasks.
        </Typography>
        {(blocked ||
          statuses.find((status) => status.id === draft.statusId)?.name ===
            "BLOCKED") && (
          <EditorSelect
            label="Blocked By Ticket"
            value={draft.blockedBy?.toString() ?? ""}
            onChange={(value) =>
              change({ blockedBy: value ? Number(value) : null })
            }
            disabled={disabled}
          >
            <MenuItem value="">
              <em>No linked ticket</em>
            </MenuItem>
            {tickets
              .filter((ticket) => ticket.id !== draft.id)
              .map((ticket) => (
                <MenuItem key={ticket.id} value={String(ticket.id)}>
                  #{ticket.id} · {ticket.title}
                </MenuItem>
              ))}
          </EditorSelect>
        )}
      </Box>
    </Box>
  );
}
