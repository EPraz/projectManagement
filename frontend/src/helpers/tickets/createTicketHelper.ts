import { Ticket } from "../../types";

/**
 * Handler para crear un ticket.
 * Currifica las dependencias para que la función resultante sólo reciba la data a crear.
 */
export const createTicketHandler =
  (
    createTicket: (data: Partial<Ticket>) => Promise<Ticket | null | undefined>,
    setOpenTicketDialog: (open: boolean) => void,
    setLocalTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    sprintId: string | undefined
  ) =>
  async (data: Partial<Ticket>) => {
    const newTicket = await createTicket({
      ...data,
      createdBy: "xana@xana.com",
      sprintId,
    });
    if (newTicket) {
      setOpenTicketDialog(false);
      setLocalTickets((prevTickets: Ticket[]) => [...prevTickets, newTicket]);
    }
  };
