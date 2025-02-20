import { DragEndEvent } from "@dnd-kit/core";
import { pickProps } from "../../../helpers";
import { Task, TaskStatus, Ticket } from "../../../types";

// Función auxiliar para actualizar la lista de tareas en localTickets para un ticket dado.
const updateTaskInTickets = (
  tickets: Ticket[],
  taskId: number,
  updateFn: (task: Task) => Task
): Ticket[] => {
  return tickets.map((ticket) => ({
    ...ticket,
    tasks: ticket.tasks.map((t) => (t.id === taskId ? updateFn(t) : t)),
  }));
};

/**
 * Handler para crear una tarea.
 * Currifica las dependencias para que la función resultante sólo reciba la data a crear.
 */
export const createTaskHandler =
  (
    createTask: (data: Partial<Task>) => Promise<Task | null | undefined>,
    setOpenTaskDialog: (open: boolean) => void,
    setLocalTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    selectedTicketId: number
  ) =>
  async (data: Partial<Task>) => {
    const newTask = await createTask({
      ...data,
      createdBy: "xana@xa.com",
      ticketId: selectedTicketId,
    });
    if (newTask) {
      setOpenTaskDialog(false);
      setLocalTickets((prevTickets: Ticket[]) =>
        prevTickets.map((ticket: Ticket) =>
          ticket.id === newTask.ticketId
            ? { ...ticket, tasks: [...ticket.tasks, newTask] }
            : ticket
        )
      );
    }
  };

/**
 * Handler para crear un ticket.
 * Currifica las dependencias para que la función resultante sólo reciba la data a crear.
 */
export const createTicketHandler =
  (
    createTicket: (data: Partial<Ticket>) => Promise<Ticket | null | undefined>,
    setOpenTicketDialog: (open: boolean) => void,
    setLocalTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    sprintId: string | undefined
  ) =>
  async (data: Partial<Ticket>) => {
    const newTicket = await createTicket({
      ...data,
      createdBy: "xana@xana.com",
      sprintId,
    });
    if (newTicket) {
      setOpenTicketDialog(false);
      setLocalTickets((prevTickets: Ticket[]) => [...prevTickets, newTicket]);
    }
  };

/**
 * Handler para cambiar el status de un ticket.
 * Se actualiza de forma optimista y luego se sincroniza con la respuesta del backend.
 */
export const changeTicketStatusHandler =
  (
    updateTicket: (data: Partial<Ticket>) => Promise<Ticket | null | undefined>,
    setLocalTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    localTickets: Ticket[],
    originalTickets: Ticket[]
  ) =>
  async (ticketId: number, newStatusId: string) => {
    // Actualización optimista
    const updatedTickets = localTickets.map((t) =>
      t.id === ticketId ? { ...t, statusId: newStatusId } : t
    );
    setLocalTickets(updatedTickets);

    // Construir el payload usando pickProps
    const ticketToUpdate = updatedTickets.find((x) => x.id === ticketId);
    if (!ticketToUpdate) return;

    const updatedData: Partial<Ticket> = {
      ...pickProps(ticketToUpdate, ["id", "statusId"]),
      updatedBy: "xana@xana.com",
    };

    // Llamada al Backend
    const updatedTicket = await updateTicket(updatedData);

    // Actualización final basada en la respuesta del backend
    if (updatedTicket) {
      setLocalTickets((prevTickets) =>
        prevTickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
      );
    } else {
      setLocalTickets(originalTickets); // Revertir en caso de error
    }
  };

/**
 * Handler para el evento onDragEnd.
 * Actualiza el status de una tarea a través de drag & drop y luego sincroniza la actualización con el backend.
 */
export const onDragEndHandler =
  (
    updateTask: (data: Partial<Task>) => Promise<Task | null | undefined>,
    setLocalTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    localTickets: Ticket[],
    originalTickets: Ticket[],
    projectTaskStatuses: TaskStatus[] | undefined
  ) =>
  async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const taskId = active.id as number;
    const newStatusName = over.id as string;

    const allTasks = localTickets.flatMap((ticket) => ticket.tasks);
    const task = allTasks.find((task) => task.id === taskId);
    if (!task) return;

    // Si el nuevo status es el mismo que el actual, no se hace nada.
    if (newStatusName === task.status.name) return;

    const newStatus = projectTaskStatuses?.find(
      (x) => x.name === newStatusName
    );

    // Actualización optimista: actualizamos localTickets
    const updatedTickets = updateTaskInTickets(localTickets, taskId, (t) => ({
      ...t,
      statusId: newStatus?.id ?? t.statusId,
    }));
    setLocalTickets(updatedTickets);

    // Obtenemos la tarea actualizada
    const taskUpdate = updatedTickets
      .flatMap((ticket) => ticket.tasks)
      .find((t) => t.id === taskId);
    if (!taskUpdate) return;

    const updatedData: Partial<Task> = {
      ...pickProps(taskUpdate, ["id", "statusId"]),
      updatedBy: "xana@xana.com",
    };

    const response = await updateTask(updatedData);
    if (response) {
      setLocalTickets((prevTickets) =>
        updateTaskInTickets(prevTickets, response.id, () => response)
      );
    } else {
      setLocalTickets(originalTickets);
    }
  };

export const updateTicketOrderHandler =
  (
    setLocalTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    localTickets: Ticket[],
    bulkUpdateTickets: (
      data: Partial<Ticket>[]
    ) => Promise<Ticket[] | null | undefined>
  ) =>
  async (ticketId: number, direction: "up" | "down") => {
    const index = localTickets.findIndex((t) => t.id === ticketId);
    if (index === -1) return;

    const getNextIndex = (index: number, direction: "up" | "down") => {
      if (direction === "up" && index > 0) return index - 1;
      if (direction === "down" && index < localTickets.length - 1)
        return index + 1;
      return null;
    };

    const newIndex = getNextIndex(index, direction);
    if (newIndex === null) return;

    const updatedTickets = [...localTickets];
    [updatedTickets[index].order, updatedTickets[newIndex].order] = [
      updatedTickets[newIndex].order,
      updatedTickets[index].order,
    ];

    const updatedData: Partial<Ticket>[] = [
      updatedTickets[index],
      updatedTickets[newIndex],
    ].map(({ id, order }) => ({
      id,
      order,
      updatedBy: "xana@xana.com",
    }));

    setLocalTickets([...updatedTickets]);

    const updatedTasks = await bulkUpdateTickets(updatedData);
    if (!updatedTasks) {
      setLocalTickets([...localTickets]);
    }
  };
