type BlockableTicket = {
  isBlocked?: boolean;
  status?: { name: string } | null;
};
export const getBlockedTickets = <T extends BlockableTicket>(
  tickets: readonly T[],
) =>
  tickets.filter(
    (ticket) => ticket.isBlocked || ticket.status?.name === "BLOCKED",
  );

type DatedTicket = {
  dueDate?: string | null;
  status?: { name: string } | null;
};
export const getTicketDeadlines = <T extends DatedTicket>(
  tickets: readonly T[],
  now = new Date(),
) => {
  const dated = tickets
    .filter(
      (ticket) =>
        ticket.status?.name !== "COMPLETED" &&
        ticket.dueDate &&
        Number.isFinite(Date.parse(ticket.dueDate)),
    )
    .sort((a, b) => Date.parse(a.dueDate!) - Date.parse(b.dueDate!));
  return {
    overdue: dated.filter(
      (ticket) => Date.parse(ticket.dueDate!) < now.getTime(),
    ),
    upcoming: dated.filter(
      (ticket) => Date.parse(ticket.dueDate!) >= now.getTime(),
    ),
  };
};
