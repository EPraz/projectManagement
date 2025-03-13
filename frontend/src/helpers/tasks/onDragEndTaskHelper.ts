import { DragEndEvent } from "@dnd-kit/core";
import { Task, TaskStatus, Ticket } from "../../types";
import { updateOrAddTaskInTickets } from "../utilityTicketsTasksHelpers";
import { pickProps } from "../selectPropsHelper";

/**
 * Handler para el evento onDragEnd.
 * Actualiza el status de una tarea a través de drag & drop y luego sincroniza la actualización con el backend.
 */
export const onDragEndTaskHandler =
  (
    updateTask: (data: Partial<Task>) => Promise<Task | null | undefined>,
    originalTickets: Ticket[],
    projectTaskStatuses: TaskStatus[] | undefined,
    updateListOfTickets: (listofTickets: Ticket[]) => void
  ) =>
  async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const taskId = active.id as number;
    const newStatusName = over.id as string;

    const allTasks = originalTickets.flatMap((ticket) => ticket.tasks);
    const task = allTasks.find((task) => task.id === taskId);
    if (!task) return;

    // Si el nuevo status es el mismo que el actual, no se hace nada.
    if (newStatusName === task.status?.name) return;

    const newStatus = projectTaskStatuses?.find(
      (x) => x.name === newStatusName
    );

    // Actualización optimista: actualizamos localTickets
    const updatedTickets = updateOrAddTaskInTickets(
      originalTickets,
      task,
      (t) => ({
        ...t,
        statusId: newStatus?.id ?? t.statusId,
      })
    );

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
      const newTicketsList = updateOrAddTaskInTickets(
        originalTickets,
        response,
        () => response
      );
      updateListOfTickets(newTicketsList);
    }
  };
