import { Sprint, Task, Ticket } from "../../types";
import { removeTaskFromTickets } from "../utilityTicketsTasksHelpers";

export const deleteTaskHandler =
  (
    deleteTask: (task: Partial<Task>) => Promise<boolean>,
    localTickets: Ticket[],
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>,
    setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    updateSprintInState: (updatedSprint: Sprint | null) => void,
    sprint: Sprint | null
  ) =>
  async (task: Partial<Task>) => {
    if (!task.id) return;
    const success = await deleteTask(task);

    if (success && sprint) {
      const updatedTickets = removeTaskFromTickets(localTickets, task.id);
      setTickets(updatedTickets);
      const updateSprint: Sprint = {
        ...sprint,
        tickets: updatedTickets,
      };
      setSprint(updateSprint);
      updateSprintInState(updateSprint);
    }
  };
