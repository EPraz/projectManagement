import { Ticket } from "../../types";

export const updateTicketOrderHandler =
  (
    setLocalTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    localTickets: Ticket[],
    bulkUpdateTickets: (
      data: Partial<Ticket>[]
    ) => Promise<Ticket[] | null | undefined>
  ) =>
  async (ticketId: number, direction: "up" | "down") => {
    const index = localTickets.findIndex((t) => t.id === ticketId);
    if (index === -1) return;

    const getNextIndex = (index: number, direction: "up" | "down") => {
      if (direction === "up" && index > 0) return index - 1;
      if (direction === "down" && index < localTickets.length - 1)
        return index + 1;
      return null;
    };

    const newIndex = getNextIndex(index, direction);
    if (newIndex === null) return;

    const updatedTickets = [...localTickets];
    [updatedTickets[index].order, updatedTickets[newIndex].order] = [
      updatedTickets[newIndex].order,
      updatedTickets[index].order,
    ];

    const updatedData: Partial<Ticket>[] = [
      updatedTickets[index],
      updatedTickets[newIndex],
    ].map(({ id, order }) => ({
      id,
      order,
      updatedBy: "xana@xana.com",
    }));

    setLocalTickets([...updatedTickets]);

    const updatedTasks = await bulkUpdateTickets(updatedData);
    if (!updatedTasks) {
      setLocalTickets([...localTickets]);
    }
  };
