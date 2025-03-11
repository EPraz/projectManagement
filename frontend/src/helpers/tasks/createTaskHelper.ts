import { Sprint, Task, Ticket } from "../../types";
import { updateOrAddTaskInTickets } from "../utilityTicketsTasksHelpers";

export const createTaskHandler =
  (
    createTask: (data: Partial<Task>) => Promise<Task | null | undefined>,
    setOpenTaskDialog: (open: boolean) => void,
    selectedTicketId: number,
    sprint: Sprint | null,
    tickets: Ticket[],
    setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>,
    updateSprintInState: (updatedSprint: Sprint | null) => void
  ) =>
  async (data: Partial<Task>) => {
    const newTask = await createTask({
      ...data,
      createdBy: "xana@xa.com",
      ticketId: selectedTicketId,
    });
    if (newTask && sprint) {
      const newTicketsList = updateOrAddTaskInTickets(
        tickets,
        newTask,
        () => newTask
      );
      setTickets(newTicketsList);
      const updateSprint: Sprint = {
        ...sprint,
        tickets: newTicketsList,
      };
      setSprint(updateSprint);
      updateSprintInState(updateSprint);
      setOpenTaskDialog(false);
    }
  };
