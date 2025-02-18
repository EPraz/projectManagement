import { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  // Dialog,
  // DialogTitle,
  // DialogContent,
  // TextField,
  // DialogActions,
  // Button,
} from "@mui/material";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import StatusConfig from "../../sprintBoardPage/StatusConfig";
import { useApi, useProject, useSprint } from "../../../context";
import TicketRow from "../../sprintBoardPage/TicketRow";
import {
  CreateTicketDialog,
  DialogForm,
  TaskColumn,
} from "../../../components";
import AddIcon from "@mui/icons-material/Add";
import { Task, Ticket } from "../../../types";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
import { ticketSchema, taskSchema } from "../../../validations"; // Importar validaciones con Yup
import { useCreateTask, useCreateTicket } from "../../../hooks";

const TaskBoard = () => {
  const { apiUrl } = useApi();
  const {
    tickets,
    sprint,
    loadTicketsBySprint: loadTickets,
    listOfSprints,
  } = useSprint();
  const { project } = useProject();
  const { createTask, loading: loadingPostTasks } = useCreateTask();
  const { createTicket, loading: loadingPostTickets } = useCreateTicket();
  const [selectedStatuses, setSelectedStatuses] = useState(
    project?.taskStatuses
  );
  const [localTickets, setLocalTickets] = useState<Ticket[]>(tickets);
  // const [openDialog, setOpenDialog] = useState(false);
  const [openTicketDialog, setOpenTicketDialog] = useState<boolean>(false);

  const [openTaskDialog, setOpenTaskDialog] = useState<boolean>(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  // Formulario para Tickets
  // const {
  //   register: registerTicket,
  //   handleSubmit: handleSubmitTicket,
  //   reset: resetTicketForm,
  //   formState: { errors: ticketErrors },
  // } = useForm({
  //   resolver: yupResolver(ticketSchema),
  // });

  // // Formulario para Tasks
  // const {
  //   register: registerTask,
  //   handleSubmit: handleSubmitTask,
  //   reset: resetTaskForm,
  //   formState: { errors: taskErrors },
  // } = useForm({
  //   resolver: yupResolver(taskSchema),
  // });

  useEffect(() => {
    setLocalTickets(tickets);
  }, [tickets]);

  // 🔹 Agregar un nuevo Ticket
  // const handleCreateTicket = async (data: Partial<Ticket>) => {
  //   try {
  //     const response = await fetch(`${apiUrl}/tickets`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         ...data,
  //         createdBy: "xana",
  //         sprintId: "selected_sprint_id",
  //         statusId: project?.ticketStatuses.find((s) => s.name === "NEW")?.id,
  //       }),
  //     });

  //     if (!response.ok) throw new Error("Failed to create ticket");
  //     loadTickets();
  //     setOpenTicketDialog(false);
  //     showSnackbarMessage("Ticket created successfully", "success");
  //   } catch (error) {
  //     console.error("Error creating ticket:", error);
  //     showSnackbarMessage("Failed to create ticket", "error");
  //   }
  // };

  // 🔹 Agregar un nuevo Task a un Ticket
  // const handleCreateTask = async (data: Partial<Task>) => {
  //   if (!data.ticketId) return;

  //   try {
  //     const response = await fetch(`${apiUrl}/tasks`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         ...data,
  //         ticketId: data.ticketId,
  //         createdBy: "xana",
  //         statusId: project?.taskStatuses.find((s) => s.name === "TODO")?.id,
  //       }),
  //     });

  //     if (!response.ok) throw new Error("Failed to create task");
  //     loadTickets();
  //     // resetTaskForm();
  //     setOpenTaskDialog(false);
  //     showSnackbarMessage("Task created successfully", "success");
  //   } catch (error) {
  //     console.error("Error creating task:", error);
  //     showSnackbarMessage("Failed to create task", "error");
  //   }
  // };

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
      loadTickets();
    } catch (error) {
      console.error("Error updating ticket status:", error);
      setLocalTickets(tickets);
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
      loadTickets();
    } catch (error) {
      console.error("Error updating task status:", error);
      setLocalTickets(tickets);
    }
  };

  const handleCreateTask = async (data: Partial<Task>) => {
    const newTask = await createTask(data);
    if (newTask) setOpenTaskDialog(false); // 🔹 Cierra el modal solo si la tarea se creó correctamente
  };

  const handleCreateTicket = async (data: Partial<Ticket>) => {
    const newTicket = await createTicket({ ...data, projectId: project?.id });
    if (newTicket) setOpenTicketDialog(false); // 🔹 Cierra el modal solo si el ticket se creó correctamente
  };

  const isDisabled = !listOfSprints || listOfSprints.length === 0;

  return (
    <Container sx={{ border: "1px solid black" }}>
      <StatusConfig
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
      />
      <Tooltip
        title={isDisabled ? "You must create a Sprint first" : ""}
        arrow
        sx={{ width: "fit-content" }}
        placement="bottom"
      >
        <span>
          <IconButton
            onClick={() => !isDisabled && setOpenTicketDialog(true)}
            disabled={isDisabled}
            sx={{
              height: "35px",
              width: "fit-content",
              border: "1px solid green",
              borderRadius: "8px",
              fontSize: "12px",
              display: "flex",
              gap: "8px",
              color: isDisabled ? "gray" : "inherit",
              borderColor: isDisabled ? "gray" : "green",
            }}
          >
            Add New Item
            <AddIcon />
          </IconButton>
        </span>
      </Tooltip>
      {openTicketDialog && (
        <DialogForm
          open={openTicketDialog}
          title="Create Ticket"
          onClose={() => setOpenTicketDialog(false)}
          onSubmit={handleCreateTicket}
          schema={ticketSchema}
          disabled={loadingPostTickets}
          defaultValues={{
            title: "",
            description: "",
            createdBy: "test@test.ccom",
            sprintId: sprint ? sprint.id : "",
          }}
        />

        // <CreateTicketDialog
        //   open={openTicketDialog}
        //   onClose={() => setOpenTicketDialog(false)}
        //   onSubmit={handleCreateTicket}
        // />
      )}

      {openTaskDialog && (
        <DialogForm
          open={openTaskDialog}
          title="Create Task"
          onClose={() => setOpenTaskDialog(false)}
          onSubmit={handleCreateTask}
          schema={taskSchema}
          disabled={loadingPostTasks}
          defaultValues={{
            title: "",
            description: "",
            createdBy: "test@test.ccom",
            ticketId: selectedTicketId ?? 0,
          }}
        />
      )}
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <Table stickyHeader aria-label="TaskBoard" width="100%">
          <TableHead>
            <TableRow>
              <TableCell>Tickets</TableCell>
              {selectedStatuses?.map((status) => (
                <TableCell key={status.id}>{status.name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {localTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  <TicketRow
                    ticket={ticket}
                    changeTicketStatus={changeTicketStatus}
                    ticketStatuses={project?.ticketStatuses}
                  />
                </TableCell>
                {selectedStatuses?.map((status) => (
                  <TaskColumn
                    key={status.id}
                    id={status.name}
                    ticketId={ticket.id}
                    tasks={ticket.tasks.filter(
                      (task) => task.statusId === status.id
                    )}
                    addTask={
                      status.name === "TODO"
                        ? () => {
                            setOpenTaskDialog(true);
                            setSelectedTicketId(ticket.id);
                          }
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
