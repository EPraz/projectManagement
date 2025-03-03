import { Task, Ticket } from "../../types";

/**
 * Handler para crear una tarea.
 * Currifica las dependencias para que la función resultante sólo reciba la data a crear.
 */
export const createTaskHandler =
  (
    createTask: (data: Partial<Task>) => Promise<Task | null | undefined>,
    setOpenTaskDialog: (open: boolean) => void,
    setLocalTickets: React.Dispatch<React.SetStateAction<Ticket[]>>,
    selectedTicketId: number
  ) =>
  async (data: Partial<Task>) => {
    const newTask = await createTask({
      ...data,
      createdBy: "xana@xa.com",
      ticketId: selectedTicketId,
    });
    if (newTask) {
      setOpenTaskDialog(false);
      setLocalTickets((prevTickets: Ticket[]) =>
        prevTickets.map((ticket: Ticket) =>
          ticket.id === newTask.ticketId
            ? { ...ticket, tasks: [...ticket.tasks, newTask] }
            : ticket
        )
      );
    }
  };
