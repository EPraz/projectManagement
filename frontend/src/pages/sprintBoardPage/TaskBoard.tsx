import { useState } from "react";
import {
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { TASK_STATUSES } from "../../constants";
import StatusConfig from "./StatusConfig";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";

import Column from "./Column";
import TicketRow from "./TicketRow";

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

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    setTickets((prevTickets) =>
      prevTickets.map((ticket) => ({
        ...ticket,
        tasks: ticket.tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        ),
      }))
    );
  };

  const addTaskToTicket = (ticketId: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9), // Generar un ID temporal
      title: `New Task ${Math.floor(Math.random() * 100)}`, // Placeholder title
      status: "To Do",
    };

    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, tasks: [...ticket.tasks, newTask] }
          : ticket
      )
    );
  };

  return (
    <Container>
      <StatusConfig
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
      />
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <Table stickyHeader aria-label="sticky table" width="100%">
          <TableHead>
            <TableRow>
              <TableCell
                style={{ borderRight: "1px solid rgba(0, 0, 0, 0.2)" }}
              >
                Tickets
              </TableCell>
              {selectedStatuses.map((status) => (
                <TableCell
                  key={status}
                  style={{ borderRight: "1px solid rgba(0, 0, 0, 0.2)" }}
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
                  style={{ borderRight: "1px solid rgba(0, 0, 0, 0.2)" }}
                >
                  <TicketRow
                    ticket={ticket}
                    changeTicketStatus={changeTicketStatus}
                  />
                </TableCell>
                {selectedStatuses.map((status) => (
                  <Column
                    key={status}
                    id={status}
                    ticketId={ticket.id}
                    tasks={ticket.tasks.filter(
                      (task) => task.status === status
                    )}
                    setTickets={setTickets}
                    addTask={
                      status === "To Do"
                        ? () => addTaskToTicket(ticket.id)
                        : undefined
                    }
                  />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DndContext>
    </Container>
  );
};

export default TaskBoard;
