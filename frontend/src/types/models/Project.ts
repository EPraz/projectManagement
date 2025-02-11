import { Epic } from "./Epic";
import { EpicStatus } from "./EpicStatus";
import { FeatureStatus } from "./FeatureStatus";
import { ProjectUser } from "./ProjectUser";
import { Sprint } from "./Sprint";
import { TaskStatus } from "./TaskStatus";
import { Ticket } from "./Ticket";
import { TicketStatus } from "./TicketStatus";

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
  users: ProjectUser[];
  sprints: Sprint[];
  ticketStatuses: TicketStatus[];
  taskStatuses: TaskStatus[];
  epicStatuses: EpicStatus[];
  featureStatuses: FeatureStatus[];
};
