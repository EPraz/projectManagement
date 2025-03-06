import { Sprint, Task, Ticket } from "../../types";
import { removeTaskFromTickets } from "../utilityTicketsTasksHelpers";

export const deleteTaskHandler =
  (
    deleteTask: (task: Partial<Task>) => Promise<boolean>,
    setLocalTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    localTickets: Ticket[],
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>
  ) =>
  async (task: Partial<Task>) => {
    if (!task.id) return;
    const success = await deleteTask(task);

    if (success) {
      const updatedTickets = removeTaskFromTickets(localTickets, task.id);
      setLocalTickets(updatedTickets);
      setSprint((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          tickets: updatedTickets,
        };
      });
    }
  };
