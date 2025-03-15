import { Ticket } from "../../types";

/**
 * Handler para crear un ticket.
 * Currifica las dependencias para que la función resultante sólo reciba la data a crear.
 */
export const createTicketHandler =
  (
    createTicket: (data: Partial<Ticket>) => Promise<Ticket | null | undefined>,
    updateAllTickets: (updateTicket: Ticket) => void
  ) =>
  async (data: Partial<Ticket>) => {
    const newTicket = await createTicket({
      ...data,
    });
    if (newTicket) {
      updateAllTickets(newTicket);
    }
  };
