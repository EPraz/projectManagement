import { Task, Ticket } from "../../types";
import { updateTaskInTickets } from "../utilityTicketsTasksHelpers";

//  Edit Task Handler
export const editTaskHandler =
  (
    updateTask: (data: Partial<Task>) => Promise<Task | null | undefined>,
    setLocalTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    localTickets: Ticket[],
    originalTickets: Ticket[]
  ) =>
  async (data: Partial<Task>) => {
    const updatedTickets = updateTaskInTickets(localTickets, data.id!, (t) => ({
      ...t,
      ...data,
    }));
    setLocalTickets(updatedTickets);

    const updatedTask = await updateTask({
      ...data,
      updatedBy: "xana@xana.com",
    });

    if (updatedTask) {
      setLocalTickets((prevTickets) =>
        updateTaskInTickets(prevTickets, updatedTask.id, () => updatedTask)
      );
    } else {
      setLocalTickets(originalTickets);
    }
  };
