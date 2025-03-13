import { Task, Ticket } from "../../types";
import { removeTaskFromTickets } from "../utilityTicketsTasksHelpers";

export const deleteTaskHandler =
  (
    deleteTask: (task: Partial<Task>) => Promise<boolean>,
    originalTickets: Ticket[],
    updateListOfTickets: (listofTickets: Ticket[]) => void
  ) =>
  async (task: Partial<Task>) => {
    if (!task.id) return;
    const success = await deleteTask(task);

    if (success) {
      const updatedTickets = removeTaskFromTickets(originalTickets, task.id);
      updateListOfTickets(updatedTickets);
    }
  };
