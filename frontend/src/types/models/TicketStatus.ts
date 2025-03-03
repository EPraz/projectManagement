import { Project } from "./Project";
import { Ticket } from "./Ticket";

export type TicketStatus = {
  id: string;
  name: string;
  position: number;
  color?: string;
  projectId?: string;
  project?: Project;
  tickets?: Ticket[];
};
