import { Sprint, Ticket } from "../../types";
import { pickProps } from "../selectPropsHelper";

/**
 * Handler para cambiar el status de un ticket.
 * Se actualiza de forma optimista y luego se sincroniza con la respuesta del backend.
 */
export const updateTicketStatusHandler =
  (
    updateTicket: (data: Partial<Ticket>) => Promise<Ticket | null | undefined>,
    originalTickets: Ticket[],
    setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>,
    updateSprintInState: (updatedSprint: Sprint | null) => void,
    sprint: Sprint | null,
    currentUserEmail: string | undefined
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

    if (updatedTicket && sprint) {
      const newTicketsList = originalTickets.map((x) =>
        x.id === updatedTicket.id ? { ...x, ...updatedTicket } : x
      );
      setTickets(newTicketsList);

      const updateSprint: Sprint = {
        ...sprint,
        tickets: newTicketsList,
      };
      setSprint(updateSprint);
      updateSprintInState(updateSprint);
    }
  };
