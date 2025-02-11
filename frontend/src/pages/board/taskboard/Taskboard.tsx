import { useState } from "react";
import {
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import StatusConfig from "../../sprintBoardPage/StatusConfig";
import { TASK_STATUSES } from "../../../constants";
import { useApi, useSprint } from "../../../context";
import TicketRow from "../../sprintBoardPage/TicketRow";
import Column from "../../sprintBoardPage/Column";
import AddIcon from "@mui/icons-material/Add";
import { Ticket } from "../../../types";
import { useParams } from "react-router-dom";

const TaskBoard = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { apiUrl } = useApi();
  const { tickets: dbTickets } = useSprint();
  const [tickets, setTickets] = useState<Ticket[]>(dbTickets);
  const [selectedStatuses, setSelectedStatuses] = useState(TASK_STATUSES);

  const changeTicketStatus = async (ticketId: string, newStatus: string) => {
    // Optimistic UI Update
    const updatedTicket = tickets.map((t) =>
      t.id === ticketId ? { ...t, status: newStatus } : t
    );
    setTickets(updatedTicket);

    try {
      await fetch(
        `${apiUrl}/projects/${projectId}/tickets/${ticketId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updatedBy: "xana", status: newStatus }),
        }
      );
    } catch (error) {
      console.error("Error updating ticket status:", error);
      setTickets(tickets); // ❌ Revertir cambio si falla
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    // Optimistic UI Update
    const updatedTickets = tickets.map((ticket) => ({
      ...ticket,
      tasks: ticket.tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ),
    }));
    setTickets(updatedTickets);

    try {
      await fetch(`${apiUrl}/projects/1/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      setTickets(tickets); // Revert changes on failure
    }
  };

  const addTaskToTicket = (ticketId: string) => {
    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: `New Task ${Math.floor(Math.random() * 100)}`,
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

  const addTicketToBoard = () => {
    const newTicket: Ticket = {
      id: Math.random().toString(36).substr(2, 9),
      title: `New Task ${Math.floor(Math.random() * 100)}`,
      status: "New",
      tasks: [],
    };

    const updateTickets = tickets.map((x) => ({ ...x, newTicket }));

    setTickets(updateTickets);
    console.log(updateTickets);
  };

  return (
    <Container>
      <StatusConfig
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
      />
      <IconButton
        onClick={() => addTicketToBoard()}
        sx={{
          height: "35px",
          width: "35px",
          border: "1px solid green",
          borderRadius: "8px",
        }}
      >
        <AddIcon />
      </IconButton>
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
                {selectedStatuses.map((status, statusIndex) => (
                  <Column
                    key={statusIndex}
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
