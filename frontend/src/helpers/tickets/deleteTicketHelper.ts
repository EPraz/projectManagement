import { Sprint, Ticket } from "../../types";

export const deleteTicketHandler =
  (
    deleteTicket: (data: Partial<Ticket>) => Promise<boolean>,
    originalTickets: Ticket[],
    setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>,
    updateSprintInState: (updatedSprint: Sprint | null) => void,
    sprint: Sprint | null
  ) =>
  async (data: Partial<Ticket>) => {
    const success = await deleteTicket(data);

    if (success && sprint) {
      const newTicketsList = originalTickets.filter((t) => t.id !== data.id);
      setTickets(newTicketsList);
      const updateSprint: Sprint = {
        ...sprint,
        tickets: newTicketsList,
      };
      setSprint(updateSprint);
      updateSprintInState(updateSprint);
    }
  };
