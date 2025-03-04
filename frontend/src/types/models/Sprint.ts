import { Project } from "./Project";
import { Ticket } from "./Ticket";

export type Sprint = {
  id: string;
  name: string;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  projectId: string;
  project: Project;
  tickets: Ticket[];
  createdAt: string;
  updatedAt: string;
  goals?: any;
};

export type CreateSprintFormData = {
  name: string;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
};
