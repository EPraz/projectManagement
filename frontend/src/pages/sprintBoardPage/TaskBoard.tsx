import { useState } from "react";
import {
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import { TASK_STATUSES, TICKET_STATUSES } from "../../constants";
import StatusConfig from "./StatusConfig";

interface Task {
  id: string;
  title: string;
  status: string;
}

interface Ticket {
  id: string;
  title: string;
  status: string;
  tasks: Task[];
}

const TaskBoard = () => {
  const [selectedStatuses, setSelectedStatuses] = useState(TASK_STATUSES);
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "1",
      title: "Sprint Planning",
      status: "Open",
      tasks: [{ id: "101", title: "Define Goals", status: "To Do" }],
    },
    {
      id: "2",
      title: "Develop Feature X",
      status: "In Progress",
      tasks: [{ id: "102", title: "Code UI", status: "In Progress" }],
    },
  ]);

  const changeTicketStatus = (ticketId: string, newStatus: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
  };

  return (
    <Container>
      <StatusConfig
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
      />
      <Table sx={{ width: "100%", border: "1px solid rgba(0, 0, 0, 0.2)" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ borderRight: "1px solid rgba(0, 0, 0, 0.2)" }}>
              Tickets
            </TableCell>
            {selectedStatuses.map((status) => (
              <TableCell
                key={status}
                sx={{
                  borderRight: "1px solid rgba(0, 0, 0, 0.2)",
                  width: `${100 / (selectedStatuses.length + 1)}%`,
                }}
              >
                {status}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell
                sx={{
                  borderRight: "1px solid rgba(0, 0, 0, 0.2)",
                  width: `${100 / (selectedStatuses.length + 1)}%`,
                }}
              >
                <Paper sx={{ padding: 1 }}>
                  {ticket.title}
                  <Select
                    value={ticket.status}
                    onChange={(e) =>
                      changeTicketStatus(ticket.id, e.target.value)
                    }
                    fullWidth
                  >
                    {TICKET_STATUSES.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </Paper>
              </TableCell>
              {selectedStatuses.map((status) => (
                <TableCell
                  key={status}
                  sx={{
                    borderRight: "1px solid rgba(0, 0, 0, 0.2)",
                    width: `${100 / (selectedStatuses.length + 1)}%`,
                  }}
                >
                  {ticket.tasks
                    .filter((task) => task.status === status)
                    .map((task) => (
                      <Paper key={task.id} sx={{ padding: 1, marginBottom: 1 }}>
                        {task.title}
                      </Paper>
                    ))}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default TaskBoard;
