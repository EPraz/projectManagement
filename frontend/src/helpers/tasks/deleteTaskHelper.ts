import { Task, Ticket } from "../../types";
import { removeTaskFromTickets } from "../utilityTicketsTasksHelpers";

//  Delete Task Handler
export const deleteTaskHandler =
  (
    deleteTask: (task: Partial<Task>) => Promise<boolean>,
    setLocalTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    localTickets: Ticket[],
    originalTickets: Ticket[]
  ) =>
  async (task: Partial<Task>) => {
    if (!task.id) return;
    const updatedTickets = removeTaskFromTickets(localTickets, task?.id);
    setLocalTickets(updatedTickets);

    const success = await deleteTask(task);

    if (!success) {
      setLocalTickets(originalTickets);
    }
    return success;
  };
