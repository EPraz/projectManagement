import { Ticket, TicketStatus } from "../../types";

export const getProjectProgress = (
  ticketStatuses: Pick<TicketStatus, "id" | "name">[],
  allTickets: { statusId?: Ticket["statusId"] | null }[]
) => {
  const totalTickets = allTickets?.length || 0;
  if (totalTickets === 0) return 0;
  const completedTickets =
    allTickets?.filter(
      (ticket) =>
        ticketStatuses.find((status) => status.id === ticket.statusId)?.name ===
        "COMPLETED"
    )?.length || 0;
  return Math.round((completedTickets / totalTickets) * 100);
};

export const formatProjectDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};
