import { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  // IconButton,
} from "@mui/material";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import StatusConfig from "../../sprintBoardPage/StatusConfig";
import { useApi, useProject, useSprint } from "../../../context";
import TicketRow from "../../sprintBoardPage/TicketRow";
// import Column from "../../sprintBoardPage/Column";
// import AddIcon from "@mui/icons-material/Add";
import { Ticket } from "../../../types";
import { TaskColumn } from "../../../components";

const TaskBoard = () => {
  const { apiUrl } = useApi();
  const { tickets, loadTickets } = useSprint();
  const { taskStatuses, ticketStatuses } = useProject();
  const [selectedStatuses, setSelectedStatuses] = useState(taskStatuses);
  const [localTickets, setLocalTickets] = useState<Ticket[]>(tickets);

  // Sincronizar Tickets con los del Backend al cambiar Sprint
  useEffect(() => {
    setLocalTickets(tickets);
  }, [tickets]);

  // 🔹 Manejar cambios de Status en los Tickets
  const changeTicketStatus = async (ticketId: number, newStatusId: string) => {
    const updatedTickets = localTickets.map((t) =>
      t.id === ticketId ? { ...t, statusId: newStatusId } : t
    );
    setLocalTickets(updatedTickets);

    try {
      await fetch(`${apiUrl}/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updatedBy: "xana", statusId: newStatusId }),
      });
      loadTickets(); // Recargar datos reales
    } catch (error) {
      console.error("Error updating ticket status:", error);
      setLocalTickets(tickets); // Revertir en caso de error
    }
  };

  // 🔹 Manejar Drag & Drop de Tasks entre Columnas
  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const taskId = active.id as number;
    const newStatusId = over.id as string;

    const updatedTickets = localTickets.map((ticket) => ({
      ...ticket,
      tasks: ticket.tasks.map((task) =>
        task.id === taskId ? { ...task, statusId: newStatusId } : task
      ),
    }));
    setLocalTickets(updatedTickets);

    try {
      await fetch(`${apiUrl}/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusId: newStatusId }),
      });
      loadTickets(); // Recargar Tickets con Tasks actualizados
    } catch (error) {
      console.error("Error updating task status:", error);
      setLocalTickets(tickets); // Revertir cambios
    }
  };

  // 🔹 Agregar un nuevo Task a un Ticket en "To Do"
  const addTaskToTicket = async (ticketId: number) => {
    try {
      const response = await fetch(`${apiUrl}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Task",
          ticketId,
          createdBy: "xana",
          statusId: taskStatuses.find((s) => s.name === "TODO")?.id,
        }),
      });
      if (!response.ok) throw new Error("Failed to create task");
      loadTickets();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <Container>
      <StatusConfig
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
      />
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <Table stickyHeader aria-label="TaskBoard" width="100%">
          <TableHead>
            <TableRow>
              <TableCell
                style={{ borderRight: "1px solid rgba(0, 0, 0, 0.2)" }}
              >
                Tickets
              </TableCell>
              {selectedStatuses.map((status) => (
                <TableCell
                  key={status.id}
                  style={{ borderRight: "1px solid rgba(0, 0, 0, 0.2)" }}
                >
                  {status.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {localTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell
                  style={{ borderRight: "1px solid rgba(0, 0, 0, 0.2)" }}
                >
                  <TicketRow
                    ticket={ticket}
                    changeTicketStatus={changeTicketStatus}
                    ticketStatuses={ticketStatuses}
                  />
                </TableCell>
                {selectedStatuses.map((status) => (
                  <TaskColumn
                    key={status.id}
                    id={status.name}
                    ticketId={ticket.id}
                    tasks={ticket.tasks.filter(
                      (task) => task.statusId === status.id
                    )}
                    addTask={
                      status.name === "TODO"
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
