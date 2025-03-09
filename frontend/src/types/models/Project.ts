import { Epic } from "./Epic";
import { EpicStatus } from "./EpicStatus";
import { FeatureStatus } from "./FeatureStatus";
import { Sprint } from "./Sprint";
import { TaskStatus } from "./TaskStatus";
import { Ticket } from "./Ticket";
import { TicketStatus } from "./TicketStatus";
import { User } from "./User";

export type Project = {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  epics: Epic[];
  tickets: Ticket[];
  users: User[];
  sprints: Sprint[];
  ticketStatuses: TicketStatus[];
  taskStatuses: TaskStatus[];
  epicStatuses: EpicStatus[];
  featureStatuses: FeatureStatus[];
  type: string;
  productManagers: User[];
  endDate?: string;
};
