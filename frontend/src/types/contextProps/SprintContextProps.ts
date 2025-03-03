import { Sprint, Ticket } from "../models";

export interface SprintContextProps {
  sprint: Sprint | null;
  listOfSprints: Sprint[] | null;
  tickets: Ticket[];
  loadingTickets: boolean;

  setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>;
  loadSprints: () => Promise<void>;
  loadTicketsBySprint: (id?: string) => Promise<void>;
}
