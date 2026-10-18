import { Box, Button, IconButton, Typography } from "@mui/material";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import type { Task, Ticket } from "../../../../types";
import { formatStatusName } from "../../../../helpers";
export default function BacklogTasks({
  ticket,
  open,
  remove,
  add,
}: {
  ticket: Ticket;
  open: (task: Task) => void;
  remove: (task: Task) => void;
  add: () => void;
}) {
  return (
    <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          mb: 1,
        }}
      >
        <Typography component="h3" sx={{ fontSize: 16, fontWeight: 600 }}>
          Tasks / {ticket.tasks.length}
        </Typography>
        <Button startIcon={<Add />} onClick={add}>
          Add task
        </Button>
      </Box>
      {!ticket.tasks.length && (
        <Typography color="text.secondary">
          No tasks yet. Add a task to break down this ticket.
        </Typography>
      )}
      {ticket.tasks.map((task) => (
        <Box
          key={task.id}
          sx={{
            display: "flex",
            alignItems: "start",
            gap: 1,
            py: 1.5,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" color="primary">
              TASK / #{task.id} ·{" "}
              {formatStatusName(task.status?.name ?? "Unclassified")}
            </Typography>
            <Button
              onClick={() => open(task)}
              sx={{
                p: 0,
                minWidth: 0,
                textAlign: "left",
                justifyContent: "flex-start",
                color: "text.primary",
                fontSize: 16,
                overflowWrap: "anywhere",
              }}
            >
              {task.title}
            </Button>
            <Typography variant="body2" color="text.secondary">
              {task.assignedUser?.name ?? "Unassigned"}
              {task.remainingHours != null
                ? ` · ${task.remainingHours} h remaining`
                : ""}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", width: 44 }}>
            <IconButton
              aria-label={`Edit task ${task.id}`}
              onClick={() => open(task)}
            >
              <EditOutlined fontSize="small" />
            </IconButton>
            <IconButton
              aria-label={`Delete task ${task.id}`}
              color="error"
              onClick={() => remove(task)}
            >
              <DeleteOutline fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
