import { Project } from "../../types";

export const getProjectProgress = (project: Project) => {
  const totalTickets = project.tickets?.length || 0;
  if (totalTickets === 0) return 0;
  const completedTickets =
    project.tickets?.filter(
      (ticket) =>
        project.ticketStatuses.find((status) => status.id === ticket.statusId)
          ?.name === "DONE"
    )?.length || 0;
  return Math.round((completedTickets / totalTickets) * 100);
};

export const formatProjectDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};
