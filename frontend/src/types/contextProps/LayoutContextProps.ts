import type { TaskUpdate, TicketUpdate } from "../../services/workItemUpdates";
import { DragEndEvent } from "@dnd-kit/core";
import {
  GoalTask,
  Sprint,
  SprintGoal,
  Task,
  TaskStatus,
  Ticket,
} from "../models";
import { useProject, useSprint, useTicket } from "../../context";
import {
  useCreateTask,
  useCreateTicket,
  useDeleteTask,
  useDeleteTicket,
  useUpdateTask,
  useUpdateTicket,
} from "../../hooks";

export interface LayoutContextProps {
  // Project
  project: ReturnType<typeof useProject>["project"];
  loadingProject: ReturnType<typeof useCreateTask>["loading"];

  // Sprint
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
  tickets: ReturnType<typeof useTicket>["tickets"];
  allTickets: ReturnType<typeof useTicket>["allTickets"];
  createTicket: ReturnType<typeof useCreateTicket>["createTicket"];
  loadingPostTickets: ReturnType<typeof useCreateTicket>["loading"];

  updateTicket: ReturnType<typeof useUpdateTicket>["updateTicket"];
  loadingUpdateTickets: ReturnType<typeof useUpdateTicket>["loading"];

  deleteTicket: ReturnType<typeof useDeleteTicket>["deleteTicket"];
  loadingDeleteTicket: ReturnType<typeof useDeleteTicket>["loading"];

  // Local State Variables
  // Local States -> Tickets
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
  filters: import("../FilterProps").FilterProps;
  setFilters: React.Dispatch<
    React.SetStateAction<import("../FilterProps").FilterProps>
  >;
  visibleColumns: string[];
  setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>;
  handleApplyFilter: (newFilters: import("../FilterProps").FilterProps) => void;

  //Local States -> Board
  tabValue: number;
  handleChangeTabValue: (newValue: number) => void;

  //Local States -> Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Local States -> Sprint
  openCreateSprintDialog: boolean;
  setOpenCreateSprintDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleCreateSprint: (data: Partial<Sprint>) => Promise<boolean>;
  handleChangeSprint: (newSprintId: string) => Promise<void>;
  handleDeleteSprint: (data: Partial<Sprint>) => Promise<boolean>;
  openDeleteSprintDialog: boolean;
  setOpenDeleteSprintDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSprint: Sprint | null;
  setSelectedSprint: React.Dispatch<React.SetStateAction<Sprint | null>>;
  loadingCreateSprint: boolean;
  loadingDeleteSprint: boolean;

  // Local States -> SprintGoal -> Goal Board
  isGoalTaskPending: (id: string) => boolean;
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
  handleCreateTicket: (data: Partial<Ticket>) => Promise<boolean>;
  handleEditTicket: (data: TicketUpdate) => Promise<boolean>;
  handleDeleteTicket: (data: Partial<Ticket>) => Promise<boolean>;
  handleUpdateTicketStatus: (
    ticketId: number,
    newStatusId: string,
  ) => Promise<void>;

  // Functions -> Tasks
  isTaskPending: (id: number) => boolean;
  isTicketPending: (id: number) => boolean;
  handleCreateTask: (data: Partial<Task>) => Promise<boolean>;
  handleEditTask: (data: TaskUpdate) => Promise<boolean>;
  handleDeleteTask: (task: Partial<Task>) => Promise<boolean>;
  handleOnDragEndTask: (event: DragEndEvent) => Promise<void>;

  // Functions -> Goal Board -> Sprint Goal
  handleCreateSprintGoal: (data: Partial<SprintGoal>) => Promise<boolean>;
  handleEditSprintGoal: (data: Partial<SprintGoal>) => Promise<boolean>;
  handleDeleteSprintGoal: (data: Partial<SprintGoal>) => Promise<boolean>;
  handleToggleGoalTaskCompletion: (
    goalTask: Partial<GoalTask>,
  ) => Promise<boolean>;
}
