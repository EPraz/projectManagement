import { format } from "date-fns";
import type { FilterProps, Ticket } from "../../../../types";
export function matchesTicket(
  ticket: Ticket,
  filters: FilterProps,
  assignee = true,
) {
  if (filters.priority && ticket.priority !== filters.priority) return false;
  if (filters.status && ticket.status?.name !== filters.status) return false;
  if (filters.type && ticket.type !== filters.type) return false;
  if (
    assignee &&
    filters.assignedUser &&
    ticket.assignedTo !== filters.assignedUser.id
  )
    return false;
  const blocked = ticket.isBlocked || ticket.status?.name === "BLOCKED";
  if (filters.isBlocked !== undefined && Boolean(blocked) !== filters.isBlocked)
    return false;
  if (
    filters.dueDate &&
    (!ticket.dueDate ||
      !Number.isFinite(Date.parse(ticket.dueDate)) ||
      format(new Date(ticket.dueDate), "yyyy-MM-dd") !== filters.dueDate)
  )
    return false;
  return true;
}
export const matchesSearch = (title: string, id: number, search = "") =>
  `${title} #${id}`.toLowerCase().includes(search.trim().toLowerCase());
export function filterTaskboard(
  tickets: Ticket[],
  filters: FilterProps,
  taskState: string,
) {
  return tickets
    .filter((ticket) => matchesTicket(ticket, filters, false))
    .map((ticket) => {
      const ticketMatch = matchesSearch(
        ticket.title,
        ticket.id,
        filters.search,
      );
      const tasks = ticket.tasks.filter(
        (task) =>
          (!filters.assignedUser ||
            task.assignedTo === filters.assignedUser.id) &&
          (!taskState || task.statusId === taskState) &&
          (ticketMatch || matchesSearch(task.title, task.id, filters.search)),
      );
      return { ticket, tasks, ticketMatch };
    })
    .filter(
      ({ tasks, ticketMatch }) =>
        tasks.length || (!filters.assignedUser && !taskState && ticketMatch),
    );
}
