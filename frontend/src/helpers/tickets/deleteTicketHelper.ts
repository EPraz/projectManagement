import { Sprint, Ticket } from "../../types";

//  Delete Ticket Handler
export const deleteTicketHandler =
  (
    deleteTicket: (data: Partial<Ticket>) => Promise<boolean>,
    setLocalTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    localTickets: Ticket[],
    originalTickets: Ticket[],
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>
  ) =>
  async (data: Partial<Ticket>) => {
    // Actualización optimista
    const updatedTickets = localTickets.filter((t) => t.id !== data.id);
    setLocalTickets(updatedTickets);

    // Llamada al Backend
    const success = await deleteTicket({
      ...data,
      updatedBy: "xana@xana.com",
    });

    // Actualización final basada en la respuesta del backend
    if (!success) {
      setLocalTickets(originalTickets); // Revertir en caso de error
      setSprint((prev) => {
        if (!prev) return prev;
        return { ...prev, tickets: originalTickets };
      });
    }
    return success;
  };
