import {
  Box,
  IconButton,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import type { Ticket, Task, TaskStatus, TicketStatus } from "../../../../types";
import { formatStatusName } from "../../../../helpers";
import {
  BoardContainer,
  TableWrapper,
  StyledTable,
  HeaderCell,
  BodyCell,
} from "./TaskBoard.styles";
import TicketCard from "./ticketCard/TicketCard";
import TaskColumn from "./taskColumn/TaskColumn";
export type BoardRow = { ticket: Ticket; tasks: Task[] };
export type BoardRowsProps = {
  rows: BoardRow[];
  collapsed: Set<number>;
  toggle: (id: number) => void;
  pending: boolean;
  isTaskPending: (id: number) => boolean;
  isTicketPending: (id: number) => boolean;
  addTask: (id: number) => void;
  changeTicket: (id: number, state: string) => void;
  ticketStatuses: TicketStatus[] | undefined;
};
export default function TaskMatrix({
  rows,
  statuses,
  collapsed,
  toggle,
  pending,
  isTaskPending,
  isTicketPending,
  addTask,
  changeTicket,
  ticketStatuses,
}: BoardRowsProps & { statuses: TaskStatus[] }) {
  return (
    <BoardContainer>
      <TableWrapper role="region" aria-label="Sprint task matrix" tabIndex={0}>
        <StyledTable
          aria-label="Tickets and task states"
          sx={{ width: 300 + statuses.length * 230 }}
        >
          <TableHead>
            <TableRow>
              <HeaderCell>Tickets / {rows.length}</HeaderCell>
              {statuses.map((status) => (
                <HeaderCell
                  key={status.id}
                  aria-label={`Task state: ${formatStatusName(status.name)}`}
                >
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        bgcolor:
                          status.name === "DONE"
                            ? "success.main"
                            : status.name === "BLOCKED"
                              ? "error.main"
                              : "primary.main",
                      }}
                    />
                    {formatStatusName(status.name)}
                    <Typography variant="body2" color="text.secondary">
                      {rows.reduce(
                        (sum, row) =>
                          sum +
                          row.tasks.filter(
                            (task) => task.statusId === status.id,
                          ).length,
                        0,
                      )}
                    </Typography>
                  </Box>
                </HeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(({ ticket, tasks }) => {
              const expanded = !collapsed.has(ticket.id);
              return (
                <TableRow key={ticket.id}>
                  <BodyCell>
                    <IconButton
                      size="small"
                      aria-label={`${expanded ? "Collapse" : "Expand"} ticket #${ticket.id}`}
                      aria-expanded={expanded}
                      onClick={() => toggle(ticket.id)}
                      sx={{ mb: 1 }}
                    >
                      {expanded ? <ExpandMore /> : <ChevronRight />}
                    </IconButton>
                    <TicketCard
                      ticket={ticket}
                      ticketStatuses={ticketStatuses}
                      onChange={changeTicket}
                      disabled={pending || isTicketPending(ticket.id)}
                    />
                  </BodyCell>
                  {expanded ? (
                    statuses.map((status) => (
                      <TaskColumn
                        key={status.id}
                        id={status.name}
                        ticketId={ticket.id}
                        tasks={tasks.filter(
                          (task) => task.statusId === status.id,
                        )}
                        pending={pending}
                        isTaskPending={isTaskPending}
                        addTask={
                          status.name === "TODO"
                            ? () => addTask(ticket.id)
                            : undefined
                        }
                      />
                    ))
                  ) : (
                    <TableCell
                      colSpan={statuses.length}
                      sx={{
                        verticalAlign: "top",
                        bgcolor: "background.default",
                        p: 3,
                      }}
                    >
                      <Typography color="text.secondary">
                        Tasks collapsed
                      </Typography>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </StyledTable>
      </TableWrapper>
    </BoardContainer>
  );
}
