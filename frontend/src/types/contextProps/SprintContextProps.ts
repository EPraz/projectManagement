import { Sprint, Ticket } from "../models";

export interface SprintContextProps {
  sprint: Sprint | null;
  // sprints: Sprint[];
  tickets: Ticket[];
  // loading: boolean;

  setSprint: (sprint: Sprint) => void;
  // loadSprints: (projectId: string) => Promise<void>;
  loadTickets: () => Promise<void>;
}
