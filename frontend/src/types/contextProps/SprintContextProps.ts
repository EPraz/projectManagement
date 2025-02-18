import { Sprint, Ticket } from "../models";

export interface SprintContextProps {
  sprint: Sprint | null;
  listOfSprints: Sprint[] | null;
  tickets: Ticket[];
  // loading: boolean;

  setSprint: (sprint: Sprint) => void;
  loadSprints: () => Promise<void>;
  loadTicketsBySprint: () => Promise<void>;
}
