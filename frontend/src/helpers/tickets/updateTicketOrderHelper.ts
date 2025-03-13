import { Ticket } from "../../types";

/*
  NOT WORKING PROPERLY
*/
export const updateTicketOrderHandler =
  (
    bulkUpdateTickets: (
      data: Partial<Ticket>[]
    ) => Promise<Ticket[] | null | undefined>,
    originalTickets: Ticket[],
    currentUserEmail: string | undefined,
    updateListOfTickets: (listofTickets: Ticket[]) => void
  ) =>
  async (ticketId: number, direction: "up" | "down") => {
    const index = originalTickets.findIndex((t) => t.id === ticketId);
    if (index === -1) return;

    const getNextIndex = (index: number, direction: "up" | "down") => {
      if (direction === "up" && index > 0) return index - 1;
      if (direction === "down" && index < originalTickets.length - 1)
        return index + 1;
      return null;
    };

    const newIndex = getNextIndex(index, direction);
    if (newIndex === null) return;

    // Clonar el array para modificar el orden de los tickets que corresponden
    const ticketsClone = [...originalTickets];
    // Intercambiamos los valores de "order" solo de los tickets a modificar
    [ticketsClone[index].order, ticketsClone[newIndex].order] = [
      ticketsClone[newIndex].order,
      ticketsClone[index].order,
    ];

    // Preparamos la data de actualización para los dos tickets modificados
    const dataToUpdate: Partial<Ticket>[] = [
      ticketsClone[index],
      ticketsClone[newIndex],
    ].map(({ id, order }) => ({
      id,
      order,
      updatedBy: currentUserEmail,
    }));

    const newTicketsList = await bulkUpdateTickets(dataToUpdate);

    if (newTicketsList) {
      updateListOfTickets(newTicketsList);
    }
  };
