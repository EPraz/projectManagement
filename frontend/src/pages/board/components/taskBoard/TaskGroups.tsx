import { Box, Button, IconButton, Paper, Typography } from "@mui/material";
import { Add, ExpandMore, ChevronRight } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import type { Task, TicketStatus } from "../../../../types";
import { formatStatusName } from "../../../../helpers";
import TicketCard from "./ticketCard/TicketCard";
import TaskCard from "./taskCard/TaskCard";
import type { BoardRowsProps } from "./TaskMatrix";
export default function TaskGroups({
  rows,
  collapsed,
  toggle,
  pending,
  isTaskPending,
  isTicketPending,
  addTask,
  changeTicket,
  ticketStatuses,
}: BoardRowsProps) {
  const [params, setParams] = useSearchParams();
  const states = [...(ticketStatuses ?? [])].sort(
    (a, b) => a.position - b.position,
  );
  const groups: { state: TicketStatus | undefined; rows: typeof rows }[] =
    states.map((state) => ({
      state,
      rows: rows.filter((row) => row.ticket.statusId === state.id),
    }));
  const unclassified = rows.filter(
    (row) => !states.some((state) => state.id === row.ticket.statusId),
  );
  if (unclassified.length)
    groups.push({ state: undefined, rows: unclassified });
  const openTask = (task: Task) => {
    const next = new URLSearchParams(params);
    next.set("taskId", String(task.id));
    next.delete("ticketId");
    next.delete("ticketTab");
    setParams(next, { replace: true });
  };
  return (
    <Box
      role="region"
      aria-label="Tickets grouped by ticket state"
      sx={{ display: "grid", gap: 3 }}
    >
      {groups
        .filter((group) => group.rows.length)
        .map(({ state, rows: items }) => (
          <Box
            component="section"
            aria-label={`Ticket state: ${formatStatusName(state?.name ?? "Unclassified")}`}
            key={state?.id ?? "unknown"}
          >
            <Typography
              component="h2"
              sx={{ fontSize: 20, fontWeight: 600, mb: 2 }}
            >
              {formatStatusName(state?.name ?? "Unclassified")}{" "}
              <Box
                component="span"
                sx={{ color: "text.secondary", fontWeight: 400 }}
              >
                / {items.length}
              </Box>
            </Typography>
            <Box sx={{ display: "grid", gap: 2 }}>
              {items.map(({ ticket, tasks }) => {
                const expanded = !collapsed.has(ticket.id);
                return (
                  <Paper
                    component="article"
                    aria-label={`Ticket #${ticket.id}`}
                    variant="outlined"
                    key={ticket.id}
                    sx={{
                      p: { xs: 2, sm: 3 },
                      borderRadius: "12px",
                      minWidth: 0,
                    }}
                  >
                    <TicketCard
                      ticket={ticket}
                      ticketStatuses={ticketStatuses}
                      onChange={changeTicket}
                      disabled={pending || isTicketPending(ticket.id)}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mt: 2,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        pt: 1,
                      }}
                    >
                      <Button
                        startIcon={expanded ? <ExpandMore /> : <ChevronRight />}
                        aria-label={`${expanded ? "Collapse" : "Expand"} ticket #${ticket.id}`}
                        aria-expanded={expanded}
                        onClick={() => toggle(ticket.id)}
                      >
                        {tasks.length} tasks
                      </Button>
                      <IconButton
                        aria-label={`Add task to ticket #${ticket.id}`}
                        onClick={() => addTask(ticket.id)}
                        disabled={pending}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                    {expanded && (
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "minmax(0,1fr)",
                            sm: "repeat(2,minmax(0,1fr))",
                          },
                          gap: 1.5,
                          mt: 1,
                        }}
                      >
                        {tasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onClick={() => openTask(task)}
                            draggable={false}
                            disabled={pending || isTaskPending(task.id)}
                          />
                        ))}
                        {!tasks.length && (
                          <Typography variant="body2" color="text.secondary">
                            No matching tasks in this ticket.
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Paper>
                );
              })}
            </Box>
          </Box>
        ))}
    </Box>
  );
}
