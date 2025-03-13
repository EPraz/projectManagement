import { Task, Ticket } from "../../types";
import { updateOrAddTaskInTickets } from "../utilityTicketsTasksHelpers";

export const editTaskHandler =
  (
    updateTask: (data: Partial<Task>) => Promise<Task | null | undefined>,
    originalTickets: Ticket[],
    updateListOfTickets: (listofTickets: Ticket[]) => void
  ) =>
  async (data: Partial<Task>) => {
    const updatedTask = await updateTask(data);
    if (updatedTask) {
      const newTicketsList = updateOrAddTaskInTickets(
        originalTickets,
        updatedTask,
        () => updatedTask
      );
      updateListOfTickets(newTicketsList);
    }
  };
