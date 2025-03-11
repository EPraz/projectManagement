import {
  GoalTask,
  Sprint,
  SprintGoal,
  Task,
  TaskStatus,
  Ticket,
  TicketStatus,
} from "../models";

export interface DialogsContainerProps {
  //Tasks
  openTaskDialog: boolean;
  setOpenTaskDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openEditTaskDialog: boolean;
  handleCreateTask: (data: Partial<Task>) => void;
  handleDeleteTask: (data: Partial<Task>) => Promise<void>;
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
  handleDeleteTicket: (data: Partial<Ticket>) => Promise<void>;
  loadingPostTickets: boolean;
  loadingUpdateTickets: boolean;
  loadingDeleteTicket: boolean;
  selectedTicket: Ticket | null;
  ticketStatuses: TicketStatus[] | undefined;

  //Sprint
  listOfSprints: Sprint[] | null;
  openCreateSprintDialog: boolean;
  setOpenCreateSprintDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleCreateSprint: (data: Partial<Sprint>) => Promise<void>;
  handleDeleteSprint: (data: Partial<Sprint>) => Promise<void>;
  openDeleteSprintDialog: boolean;
  setOpenDeleteSprintDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSprint: Sprint | null;
  loadingCreateSprint: boolean;
  loadingDeleteSprint: boolean;

  // Local States -> SprintGoal -> Goal Board
  openCreateSprintGoalDialog: boolean;
  loadingCreateSprintGoal: boolean;
  handleCreateSprintGoal: (data: Partial<SprintGoal>) => Promise<void>;
  setOpenCreateSprintGoalDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSprintGoal: SprintGoal | null;
  openDeleteSprintGoalDialog: boolean;
  setOpenDeleteSprintGoalDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSprintGoal: React.Dispatch<
    React.SetStateAction<SprintGoal | null>
  >;
  handleDeleteSprintGoal: (data: Partial<SprintGoal>) => Promise<void>;
  handleEditSprintGoal: (data: Partial<SprintGoal>) => Promise<void>;
  loadingDeleteSprintGoal: boolean;
  loadingUpdateSprintGoal: boolean;
  openEditSprintGoalDialog: boolean;
  setOpenEditSprintGoalDialog: React.Dispatch<React.SetStateAction<boolean>>;

  openCreateTaskToSprintGoalDialog: boolean;
  setOpenCreateGoalTaskDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleCreateGoalTask: (data: Partial<GoalTask>) => Promise<void>;
  loadingCreateGoalTask: boolean;
  loadingUpdateGoalTask: boolean;
  handleEditGoalTask: (data: Partial<GoalTask>) => Promise<void>;
  openEditGoalTaskDialog: boolean;
  setOpenEditGoalTaskDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openDeleteGoalTaskDialog: boolean;
  setOpenDeleteGoalTaskDialog: React.Dispatch<React.SetStateAction<boolean>>;
  loadingDeleteGoalTask: boolean;
  handleDeleteGoalTask: (goalTask: Partial<GoalTask>) => Promise<void>;
  selectedGoalTask: GoalTask | null;
  setSelectedGoalTask: React.Dispatch<React.SetStateAction<GoalTask | null>>;
}
