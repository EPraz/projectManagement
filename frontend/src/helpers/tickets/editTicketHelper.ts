import { Sprint, Ticket } from "../../types";

//  Edit Ticket Handler
export const editTicketHandler =
  (
    updateTicket: (data: Partial<Ticket>) => Promise<Ticket | null | undefined>,
    originalTickets: Ticket[],
    setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>,
    updateListOfSprints: (updatedSprint: Sprint) => void,
    sprint: Sprint | null
  ) =>
  async (data: Partial<Ticket>) => {
    const updatedTicket = await updateTicket({
      ...data,
    });

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
      updateListOfSprints(updateSprint);
    }
  };
