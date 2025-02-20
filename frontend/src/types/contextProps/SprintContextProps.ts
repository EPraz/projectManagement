import { Sprint, Ticket } from "../models";

export interface SprintContextProps {
  sprint: Sprint | null;
  listOfSprints: Sprint[] | null;
  tickets: Ticket[];
  loadingTickets: boolean;

  setSprint: (sprint: Sprint) => void;
  loadSprints: () => Promise<void>;
  loadTicketsBySprint: (id?: string) => Promise<void>;
}
