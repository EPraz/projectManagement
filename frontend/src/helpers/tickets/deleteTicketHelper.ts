import { Sprint, Ticket } from "../../types";

export const deleteTicketHandler =
  (
    deleteTicket: (data: Partial<Ticket>) => Promise<boolean>,
    setLocalTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    localTickets: Ticket[],
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>
  ) =>
  async (data: Partial<Ticket>) => {
    const success = await deleteTicket(data);

    if (success) {
      const updatedTickets = localTickets.filter((t) => t.id !== data.id);
      setLocalTickets(updatedTickets);
      setSprint((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tickets: prev.tickets.filter((ticket) => ticket.id !== data.id),
        };
      });
    }
  };
