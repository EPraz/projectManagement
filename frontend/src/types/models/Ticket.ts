import { Feature } from "./Feature";
import { Project } from "./Project";
import { Sprint } from "./Sprint";
import { Task } from "./Task";
import { TicketStatus } from "./TicketStatus";

export type Ticket = {
  id: number;
  title: string;
  description?: string;
  acceptanceCriteria?: string;
  discussion?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  status: TicketStatus;
  statusId: string;
  featureId?: string;
  feature?: Feature;
  projectId?: string;
  project?: Project;
  tasks: Task[];
  sprintId?: string;
  sprint?: Sprint;
  order: number;
};
