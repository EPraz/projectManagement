import { Project } from "./Project";
import { Ticket } from "./Ticket";

export type Sprint = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  projectId: string;
  project: Project;
  tickets: Ticket[];
  createdAt: string;
  updatedAt: string;
};
