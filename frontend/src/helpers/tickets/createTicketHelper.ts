import { Sprint, Ticket } from "../../types";

/**
 * Handler para crear un ticket.
 * Currifica las dependencias para que la función resultante sólo reciba la data a crear.
 */
export const createTicketHandler =
  (
    createTicket: (data: Partial<Ticket>) => Promise<Ticket | null | undefined>,
    originalTickets: Ticket[],
    setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>,
    updateSprintInState: (updatedSprint: Sprint | null) => void,
    sprint: Sprint | null
  ) =>
  async (data: Partial<Ticket>) => {
    const newTicket = await createTicket({
      ...data,
    });
    if (newTicket && sprint) {
      const newTicketsList = [...originalTickets, newTicket];
      setTickets(newTicketsList);
      const updateSprint: Sprint = {
        ...sprint,
        tickets: newTicketsList,
      };
      setSprint(updateSprint);
      updateSprintInState(updateSprint);
    }
  };
