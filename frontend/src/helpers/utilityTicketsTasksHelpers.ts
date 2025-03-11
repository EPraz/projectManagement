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

export const updateOrAddTaskInTickets = (
  tickets: Ticket[],
  task: Task,
  updateFn: (existingTask: Task) => Task
): Ticket[] => {
  return tickets.map((ticket) => {
    // Solo actualizamos el ticket que corresponde al task
    if (ticket.id === task.ticketId) {
      const taskExists = ticket.tasks.some((t) => t.id === task.id);
      return {
        ...ticket,
        tasks: taskExists
          ? ticket.tasks.map((t) => (t.id === task.id ? updateFn(t) : t))
          : [...ticket.tasks, task],
      };
    }
    return ticket;
  });
};
