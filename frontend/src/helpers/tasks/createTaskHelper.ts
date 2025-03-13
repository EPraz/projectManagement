import { Task, Ticket } from "../../types";
import { updateOrAddTaskInTickets } from "../utilityTicketsTasksHelpers";

export const createTaskHandler =
  (
    createTask: (data: Partial<Task>) => Promise<Task | null | undefined>,
    selectedTicketId: number,
    tickets: Ticket[],
    updateListOfTickets: (listofTickets: Ticket[]) => void
  ) =>
  async (data: Partial<Task>) => {
    const newTask = await createTask({
      ...data,
      ticketId: selectedTicketId,
    });
    if (newTask) {
      const newTicketsList = updateOrAddTaskInTickets(
        tickets,
        newTask,
        () => newTask
      );
      updateListOfTickets(newTicketsList);
    }
  };
