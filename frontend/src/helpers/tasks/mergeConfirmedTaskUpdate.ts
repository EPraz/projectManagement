import { Task, Ticket } from "../../types";

export const mergeConfirmedTaskUpdate = (tickets: Ticket[], task: Task): Ticket[] => {
  const confirmedAt = Date.parse(task.updatedAt);
  if (!Number.isFinite(confirmedAt)) return tickets;
  return tickets.map((ticket) => {
    if (ticket.id !== task.ticketId) return ticket;
    return {
      ...ticket,
      // Movement cannot recreate work removed by another client.
      tasks: ticket.tasks.map((current) => {
        if (current.id !== task.id || Date.parse(current.updatedAt) >= confirmedAt) return current;
        return task;
      }),
    };
  });
};
