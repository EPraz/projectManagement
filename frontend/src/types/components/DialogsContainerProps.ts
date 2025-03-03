import { Sprint, Task, TaskStatus, Ticket, TicketStatus } from "../models";

export interface DialogsContainerProps {
  //Tasks
  openTaskDialog: boolean;
  setOpenTaskDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openEditTaskDialog: boolean;
  handleCreateTask: (data: Partial<Task>) => void;
  handleDeleteTask: (data: Partial<Task>) => Promise<boolean | undefined>;
  loadingPostTasks: boolean;
  setOpenEditTaskDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleEditTask: (data: Partial<Task>) => void;
  loadingUpdateTask: boolean;
  loadingDeleteTask: boolean;
  selectedTask: Task | null;
  selectedTasksStatuses: TaskStatus[] | undefined;
  openDeleteTaskDialog: boolean;
  setOpenDeleteTaskDialog: React.Dispatch<React.SetStateAction<boolean>>;

  //Tickets
  openCreateTicketDialog: boolean;
  setOpenCreateTicketDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openEditTicketDialog: boolean;
  setOpenEditTicketDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openDeleteTicketDialog: boolean;
  setOpenDeleteTicketDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleCreateTicket: (data: Partial<Ticket>) => void;
  handleEditTicket: (data: Partial<Ticket>) => void;
  handleDeleteTicket: (data: Partial<Ticket>) => Promise<boolean | undefined>;
  loadingPostTickets: boolean;
  loadingUpdateTickets: boolean;
  loadingDeleteTicket: boolean;
  selectedTicket: Ticket | null;
  ticketStatuses: TicketStatus[] | undefined;
  //Sprint
  listOfSprints: Sprint[] | null;
  openCreateSprintDialog: boolean;
  setOpenCreateSprintDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleCreateSprint: (data: Partial<Sprint>) => Promise<Sprint | null>;
  handleDeleteSprint: (data: Partial<Sprint>) => Promise<void>;
  openDeleteSprintDialog: boolean;
  setOpenDeleteSprintDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSprint: Sprint | null;
  loadingCreateSprint: boolean;
  loadingDeleteSprint: boolean;
}
