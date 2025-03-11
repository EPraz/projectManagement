import { Sprint, Task, Ticket } from "../../types";
import { updateOrAddTaskInTickets } from "../utilityTicketsTasksHelpers";

export const editTaskHandler =
  (
    updateTask: (data: Partial<Task>) => Promise<Task | null | undefined>,
    originalTickets: Ticket[],
    setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>,
    updateSprintInState: (updatedSprint: Sprint | null) => void,
    sprint: Sprint | null
  ) =>
  async (data: Partial<Task>) => {
    const updatedTask = await updateTask(data);
    if (updatedTask && sprint) {
      const newTicketsList = updateOrAddTaskInTickets(
        originalTickets,
        updatedTask,
        () => updatedTask
      );
      setTickets(newTicketsList);
      const updateSprint: Sprint = {
        ...sprint,
        tickets: newTicketsList,
      };
      setSprint(updateSprint);
      updateSprintInState(updateSprint);
    }
  };
