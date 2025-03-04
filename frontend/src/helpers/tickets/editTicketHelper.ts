import { Sprint, Ticket } from "../../types";
import { pickProps } from "../selectPropsHelper";

//  Edit Ticket Handler
export const editTicketHandler =
  (
    updateTicket: (data: Partial<Ticket>) => Promise<Ticket | null | undefined>,
    setLocalTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    localTickets: Ticket[],
    originalTickets: Ticket[],
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>
  ) =>
  async (data: Partial<Ticket>) => {
    // Actualización optimista
    const updatedTickets = localTickets.map((t) =>
      t.id === data.id ? { ...t, ...data } : t
    );
    setLocalTickets(updatedTickets);

    const updatedData: Partial<Ticket> = {
      ...pickProps(data, [
        "id",
        "statusId",
        "title",
        "sprintId",
        "description",
        "additionalDetails",
        "acceptanceCriteria",
        "designInformation",
        "notes",
      ]),
      updatedBy: "xana@xana.com",
    };

    const updatedTicket = await updateTicket({
      ...updatedData,
      // updatedBy: "xana@xana.com",
    });

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
      setLocalTickets(originalTickets);
      setSprint((prev) => {
        if (!prev) return prev;
        return { ...prev, tickets: originalTickets };
      });
    }
  };
