import type { Project } from "./Project";
import type { Sprint } from "./Sprint";
import type { Ticket } from "./Ticket";
import type { TicketStatus } from "./TicketStatus";
import type { User } from "./User";

export type ProjectSummary = Pick<
  Project,
  "id" | "title" | "createdAt" | "createdBy"
> & {
  description?: string | null;
  updatedBy?: string | null;
  tickets: Pick<Ticket, "statusId">[];
  sprints: Pick<Sprint, "id">[];
  ticketStatuses: Pick<TicketStatus, "id" | "name">[];
  users: Pick<User, "id" | "name" | "email">[];
};
