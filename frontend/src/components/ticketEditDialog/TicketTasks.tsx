import { Box, Button, ButtonBase, Typography } from "@mui/material";
import { Add, ChevronRight } from "@mui/icons-material";
import type { Task, Ticket } from "../../types";
import { formatStatusName } from "../../helpers";
export default function TicketTasks({
  ticket,
  disabled,
  onCreate,
  onOpen,
}: {
  ticket: Ticket | null;
  disabled: boolean;
  onCreate?: () => void;
  onOpen?: (task: Task) => void;
}) {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Typography component="h3" variant="h4">
          {ticket?.tasks.length ?? 0} child tasks
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Add />}
          disabled={disabled || !ticket?.id || !onCreate}
          onClick={onCreate}
        >
          Add task
        </Button>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Task states track execution independently from the ticket state.
      </Typography>
      {!ticket?.id ? (
        <Typography color="text.secondary">
          Save this ticket before adding tasks.
        </Typography>
      ) : !ticket.tasks.length ? (
        <Typography color="text.secondary">
          No tasks yet. Add a task to break down this ticket.
        </Typography>
      ) : (
        ticket.tasks.map((task) => (
          <ButtonBase
            key={task.id}
            aria-label={`Open task #${task.id} ${task.title}`}
            disabled={disabled || !onOpen}
            onClick={() => onOpen?.(task)}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
              width: "100%",
              textAlign: "left",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 2,
              mb: 1.5,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" color="primary">
                TASK / #{task.id}
              </Typography>
              <Typography fontWeight={500} sx={{ overflowWrap: "anywhere" }}>
                {task.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatStatusName(task.status?.name || "No state")} ·{" "}
                {task.assignedUser?.name || "Unassigned"}
                {task.remainingHours != null
                  ? ` · ${task.remainingHours} h remaining`
                  : ""}
              </Typography>
            </Box>
            <ChevronRight fontSize="small" />
          </ButtonBase>
        ))
      )}
    </Box>
  );
}
