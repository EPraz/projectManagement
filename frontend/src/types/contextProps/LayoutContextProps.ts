import { DragEndEvent } from "@dnd-kit/core";
import {
  GoalTask,
  Sprint,
  SprintGoal,
  Task,
  TaskStatus,
  Ticket,
  User,
} from "../models";
import { useProject, useSprint } from "../../context";
import {
  useBulkUpdateTickets,
  useCreateTask,
  useCreateTicket,
  useDeleteTask,
  useDeleteTicket,
  useUpdateTask,
  useUpdateTicket,
} from "../../hooks";
import { TicketPriority, TicketType } from "../../constants";

export interface LayoutContextProps {
  // Project
  project: ReturnType<typeof useProject>["project"];
  loadingProject: ReturnType<typeof useCreateTask>["loading"];

  // Sprint
  tickets: ReturnType<typeof useSprint>["tickets"];
  sprint: ReturnType<typeof useSprint>["sprint"];
  listOfSprints: ReturnType<typeof useSprint>["listOfSprints"];

  // Tasks
  createTask: ReturnType<typeof useCreateTask>["createTask"];
  loadingPostTasks: ReturnType<typeof useCreateTask>["loading"];

  updateTask: ReturnType<typeof useUpdateTask>["updateTask"];
  loadingUpdateTask: ReturnType<typeof useUpdateTask>["loading"];

  deleteTask: ReturnType<typeof useDeleteTask>["deleteTask"];
  loadingDeleteTask: ReturnType<typeof useDeleteTask>["loading"];

  // Tickets
  createTicket: ReturnType<typeof useCreateTicket>["createTicket"];
  loadingPostTickets: ReturnType<typeof useCreateTicket>["loading"];

  updateTicket: ReturnType<typeof useUpdateTicket>["updateTicket"];
  loadingUpdateTickets: ReturnType<typeof useUpdateTicket>["loading"];

  bulkUpdateTickets: ReturnType<
    typeof useBulkUpdateTickets
  >["bulkUpdateTickets"];
  loadingBulkUpdateTickets: ReturnType<typeof useBulkUpdateTickets>["loading"];

  deleteTicket: ReturnType<typeof useDeleteTicket>["deleteTicket"];
  loadingDeleteTicket: ReturnType<typeof useDeleteTicket>["loading"];

  // Local State Variables
  // Local States -> Tickets
  localTickets: ReturnType<typeof useSprint>["tickets"];
  setLocalTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  openCreateTicketDialog: boolean;
  setOpenCreateTicketDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTicketId: number;
  setSelectedTicketId: React.Dispatch<React.SetStateAction<number>>;
  openEditTicketDialog: boolean;
  setOpenEditTicketDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTicket: Ticket | null;
  setSelectedTicket: React.Dispatch<React.SetStateAction<Ticket | null>>;
  openDeleteTicketDialog: boolean;
  setOpenDeleteTicketDialog: React.Dispatch<React.SetStateAction<boolean>>;

  // Local States -> Tasks
  selectedTasksStatuses: TaskStatus[] | undefined;
  setSelectedTasksStatuses: React.Dispatch<
    React.SetStateAction<TaskStatus[] | undefined>
  >;
  openTaskDialog: boolean;
  setOpenTaskDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openEditTaskDialog: boolean;
  setOpenEditTaskDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTask: Task | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  openDeleteTaskDialog: boolean;
  setOpenDeleteTaskDialog: React.Dispatch<React.SetStateAction<boolean>>;

  // Local States -> Filters Backlog
  filters: {
    priority?: TicketPriority;
    status?: string;
    assignedUser?: User;
    type?: TicketType;
    dueDate?: string;
    isBlocked?: boolean;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      priority?: TicketPriority;
      status?: string;
      assignedUser?: User;
      type?: TicketType;
      dueDate?: string;
      isBlocked?: boolean;
    }>
  >;
  visibleColumns: string[];
  setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>;
  handleApplyFilter: (newFilters: any) => void;

  //Local States -> Board
  tabValue: number;
  setTabValue: React.Dispatch<React.SetStateAction<number>>;
  handleChangeTabValue: (newValue: number) => void;

  //Local States -> Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Local States -> Sprint
  openCreateSprintDialog: boolean;
  setOpenCreateSprintDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleCreateSprint: (data: Partial<Sprint>) => Promise<Sprint | null>;
  handleChangeSprint: (newSprintId: string) => Promise<void>;
  handleDeleteSprint: (
    dataId: string,
    event: React.MouseEvent
  ) => Promise<void>;
  openDeleteSprintDialog: boolean;
  setOpenDeleteSprintDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSprint: Sprint | null;
  setSelectedSprint: React.Dispatch<React.SetStateAction<Sprint | null>>;
  loadingCreateSprint: boolean;
  loadingDeleteSprint: boolean;

  // Local States -> SprintGoal -> Goal Board
  localSprintGoals: SprintGoal[];
  setLocalSprintGoals: React.Dispatch<React.SetStateAction<SprintGoal[]>>;
  selectedSprintGoal: SprintGoal | null;
  setSelectedSprintGoal: React.Dispatch<
    React.SetStateAction<SprintGoal | null>
  >;
  selectedGoalTask: GoalTask | null;
  setSelectedGoalTask: React.Dispatch<React.SetStateAction<GoalTask | null>>;
  openCreateSprintGoalDialog: boolean;
  setOpenCreateSprintGoalDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openEditSprintGoalDialog: boolean;
  setOpenEditSprintGoalDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openDeleteSprintGoalDialog: boolean;
  setOpenDeleteSprintGoalDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openCreateTaskToSprintGoalDialog: boolean;
  setOpenCreateGoalTaskDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openDeleteGoalTaskDialog: boolean;
  setOpenDeleteGoalTaskDialog: React.Dispatch<React.SetStateAction<boolean>>;
  loadingCreateSprintGoal: boolean;
  loadingDeleteSprintGoal: boolean;
  loadingUpdateSprintGoal: boolean;

  openEditGoalTaskDialog: boolean;
  setOpenEditGoalTaskDialog: React.Dispatch<React.SetStateAction<boolean>>;

  // Functions
  // Functions -> Tickets
  handleCreateTicket: (data: Partial<Ticket>) => Promise<void>;
  handleEditTicket: (data: Partial<Ticket>) => Promise<void>;
  handleDeleteTicket: (data: Partial<Ticket>) => Promise<boolean>;
  handleUpdateTicketOrder: (
    ticketId: number,
    direction: "up" | "down"
  ) => Promise<void>;
  handleUpdateTicketStatus: (
    ticketId: number,
    newStatusId: string
  ) => Promise<void>;

  // Functions -> Tasks
  handleCreateTask: (data: Partial<Task>) => Promise<void>;
  handleEditTask: (data: Partial<Task>) => Promise<void>;
  handleDeleteTask: (task: Partial<Task>) => Promise<boolean | undefined>;
  handleOnDragEndTask: (event: DragEndEvent) => Promise<void>;

  // Functions -> Goal Board -> Sprint Goal
  handleCreateSprintGoal: (data: Partial<SprintGoal>) => Promise<void>;
  handleEditSprintGoal: (data: Partial<SprintGoal>) => Promise<void>;
  handleDeleteSprintGoal: (data: Partial<SprintGoal>) => Promise<void>;
  handleToggleGoalTaskCompletion: (
    goalTask: Partial<GoalTask>
  ) => Promise<void>;
}
