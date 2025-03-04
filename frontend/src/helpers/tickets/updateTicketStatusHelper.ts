import { Sprint, Ticket } from "../../types";
import { pickProps } from "../selectPropsHelper";

/**
 * Handler para cambiar el status de un ticket.
 * Se actualiza de forma optimista y luego se sincroniza con la respuesta del backend.
 */
export const updateTicketStatusHandler =
  (
    updateTicket: (data: Partial<Ticket>) => Promise<Ticket | null | undefined>,
    setLocalTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    localTickets: Ticket[],
    originalTickets: Ticket[],
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>
  ) =>
  async (ticketId: number, newStatusId: string) => {
    // Actualización optimista
    const updatedTickets = localTickets.map((t) =>
      t.id === ticketId ? { ...t, statusId: newStatusId } : t
    );
    setLocalTickets(updatedTickets);

    // Construir el payload usando pickProps
    const ticketToUpdate = updatedTickets.find((x) => x.id === ticketId);
    if (!ticketToUpdate) return;

    const updatedData: Partial<Ticket> = {
      ...pickProps(ticketToUpdate, ["id", "statusId"]),
      updatedBy: "xana@xana.com",
    };

    // Llamada al Backend
    const updatedTicket = await updateTicket(updatedData);

    // Actualización final basada en la respuesta del backend
    if (updatedTicket) {
      setLocalTickets((prevTickets) =>
        prevTickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
      );
      setSprint((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tickets: prev.tickets.map((t) =>
            t.id === updatedTicket.id ? updatedTicket : t
          ),
        };
      });
    } else {
      setLocalTickets(originalTickets); // Revertir en caso de error
      setSprint((prev) => {
        if (!prev) return prev;
        return { ...prev, tickets: originalTickets };
      });
    }
  };
