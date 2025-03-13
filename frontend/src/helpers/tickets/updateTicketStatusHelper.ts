import { Ticket } from "../../types";
import { pickProps } from "../selectPropsHelper";

/**
 * Handler para cambiar el status de un ticket.
 * Se actualiza de forma optimista y luego se sincroniza con la respuesta del backend.
 */
export const updateTicketStatusHandler =
  (
    updateTicket: (data: Partial<Ticket>) => Promise<Ticket | null | undefined>,
    originalTickets: Ticket[],
    currentUserEmail: string | undefined,
    updateAllTickets: (updateTicket: Ticket) => void
  ) =>
  async (ticketId: number, newStatusId: string) => {
    const ticketToUpdate = originalTickets
      .map((t) => (t.id === ticketId ? { ...t, statusId: newStatusId } : t))
      .find((x) => x.id === ticketId);

    if (!ticketToUpdate) return;

    const dataToUpdate: Partial<Ticket> = {
      ...pickProps(ticketToUpdate, ["id", "statusId"]),
      updatedBy: currentUserEmail,
    };

    const updatedTicket = await updateTicket(dataToUpdate);

    if (updatedTicket) {
      updateAllTickets(updatedTicket);
    }
  };
