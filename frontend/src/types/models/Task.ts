import { TaskStatus } from "./TaskStatus";
import { Ticket } from "./Ticket";
import { User } from "./User";

export type Task = {
  id: number;
  title: string;
  description?: string;
  acceptanceCriteria?: string;
  discussion?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt: string;
  statusId?: string;
  status?: TaskStatus;
  ticketId?: number;
  ticket?: Ticket;
  order: number;
  // priority: string;
  assignedTo?: string;
  assignedUser?: User;
  estimatedHours?: number;
  remainingHours?: number;
  completedHours?: number;
};
