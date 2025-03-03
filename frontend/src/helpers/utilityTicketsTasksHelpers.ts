import { Task, Ticket } from "../types";

export const removeTaskFromTickets = (
  tickets: Ticket[],
  taskId: number
): Ticket[] => {
  return tickets.map((ticket) => ({
    ...ticket,
    tasks: ticket.tasks.filter((t) => t.id !== taskId),
  }));
};

// Función auxiliar para actualizar la lista de tareas en localTickets para un ticket dado.
export const updateTaskInTickets = (
  tickets: Ticket[],
  taskId: number,
  updateFn: (task: Task) => Task
): Ticket[] => {
  return tickets.map((ticket) => ({
    ...ticket,
    tasks: ticket.tasks.map((t) => (t.id === taskId ? updateFn(t) : t)),
  }));
};
