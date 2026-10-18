import { useState, type ReactNode } from "react";
import {
  Box,
  Button,
  MenuItem,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import { FilterList, RestartAlt, Search } from "@mui/icons-material";
import type { FilterProps, Project } from "../../../../types";
import { TicketPriority, TicketType } from "../../../../constants";
import { formatStatusName } from "../../../../helpers";
import EditorSelect from "../../../../components/workItemEditor/EditorSelect";
export default function WorkFilters({
  filters,
  setFilters,
  project,
  scope,
  taskState,
  onTaskState,
  actions,
}: {
  filters: FilterProps;
  setFilters: (filters: FilterProps) => void;
  project: Project | null | undefined;
  scope: "task" | "ticket";
  taskState?: string;
  onTaskState?: (id: string) => void;
  actions?: ReactNode;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const secondary = [
    filters.priority,
    filters.type,
    filters.dueDate,
    filters.isBlocked !== undefined ? true : undefined,
  ].filter(Boolean).length;
  return (
    <Box sx={{ display: "grid", gap: 2, mb: 3 }}>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}
      >
        <TextField
          label="Search work"
          placeholder="Title or #ID"
          value={filters.search ?? ""}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          size="small"
          sx={{ flex: "1 1 240px" }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
          }}
        />
        <Box sx={{ flex: "1 1 190px" }}>
          <EditorSelect
            label={scope === "task" ? "Task assignee" : "Ticket assignee"}
            value={filters.assignedUser?.id ?? ""}
            onChange={(id) =>
              setFilters({
                ...filters,
                assignedUser: project?.users.find((user) => user.id === id),
              })
            }
          >
            <MenuItem value="">All teammates</MenuItem>
            {project?.users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </EditorSelect>
        </Box>
        <Box sx={{ flex: "1 1 170px" }}>
          <EditorSelect
            label="Ticket state"
            value={filters.status ?? ""}
            onChange={(status) => setFilters({ ...filters, status })}
          >
            <MenuItem value="">All ticket states</MenuItem>
            {project?.ticketStatuses.map((status) => (
              <MenuItem key={status.id} value={status.name}>
                {formatStatusName(status.name)}
              </MenuItem>
            ))}
          </EditorSelect>
        </Box>
        {onTaskState && (
          <Box sx={{ flex: "1 1 170px" }}>
            <EditorSelect
              label="Task state"
              value={taskState ?? ""}
              onChange={onTaskState}
            >
              <MenuItem value="">All task states</MenuItem>
              {project?.taskStatuses.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {formatStatusName(status.name)}
                </MenuItem>
              ))}
            </EditorSelect>
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
            flex: { xs: "1 1 100%", lg: "0 1 auto" },
          }}
        >
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={(e) => setAnchor(e.currentTarget)}
          >
            Filters{secondary ? ` (${secondary})` : ""}
          </Button>
          <Button
            startIcon={<RestartAlt />}
            onClick={() => {
              setFilters({});
              onTaskState?.("");
            }}
          >
            Clear filters
          </Button>
          {actions}
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {scope === "task"
          ? "Assignee filters tasks and keeps their parent tickets. Ticket state and task state are separate."
          : "Assignee filters tickets in the selected sprint."}
      </Typography>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box
          sx={{
            p: 3,
            width: "min(360px,calc(100vw - 32px))",
            display: "grid",
            gap: 3,
          }}
        >
          <Typography component="h2" variant="h4">
            Ticket filters
          </Typography>
          <EditorSelect
            label="Priority"
            value={filters.priority ?? ""}
            onChange={(priority) =>
              setFilters({ ...filters, priority: priority as TicketPriority })
            }
          >
            <MenuItem value="">All priorities</MenuItem>
            {Object.values(TicketPriority).map((p) => (
              <MenuItem key={p} value={p}>
                {formatStatusName(p)}
              </MenuItem>
            ))}
          </EditorSelect>
          <EditorSelect
            label="Type"
            value={filters.type ?? ""}
            onChange={(type) =>
              setFilters({ ...filters, type: type as TicketType })
            }
          >
            <MenuItem value="">All types</MenuItem>
            {Object.values(TicketType).map((type) => (
              <MenuItem key={type} value={type}>
                {formatStatusName(type)}
              </MenuItem>
            ))}
          </EditorSelect>
          <EditorSelect
            label="Blocked"
            value={
              filters.isBlocked === undefined ? "" : String(filters.isBlocked)
            }
            onChange={(value) =>
              setFilters({
                ...filters,
                isBlocked: value === "" ? undefined : value === "true",
              })
            }
          >
            <MenuItem value="">All tickets</MenuItem>
            <MenuItem value="true">Blocked</MenuItem>
            <MenuItem value="false">Not blocked</MenuItem>
          </EditorSelect>
          <TextField
            type="date"
            label="Due date"
            InputLabelProps={{ shrink: true }}
            value={filters.dueDate ?? ""}
            onChange={(e) =>
              setFilters({ ...filters, dueDate: e.target.value })
            }
            size="small"
          />
          <Button variant="contained" onClick={() => setAnchor(null)}>
            Show results
          </Button>
        </Box>
      </Popover>
    </Box>
  );
}
