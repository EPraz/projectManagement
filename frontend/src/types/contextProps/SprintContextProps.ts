import { Sprint } from "./Sprint";
import { Ticket } from "./Ticket";

export interface SprintContextProps {
  sprint: Sprint | null;
  sprints: Sprint[];
  tickets: Ticket[];

  setSprint: (sprint: Sprint) => void;
  loadSprints: (projectId: string) => Promise<void>;
  loadTickets: () => Promise<void>;
}
