import {
  Feature,
  Project,
  Sprint,
  Ticket,
  TicketStatus,
  User,
} from "../models";

export interface TicketEditDialogProps {
  open: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onSave: (ticket: Partial<Ticket>) => void;
  onDelete?: (ticket: Partial<Ticket>) => void;
  statuses: TicketStatus[] | undefined;
  users: User[] | undefined;
  sprints: Sprint[] | null;
  features: Feature[] | undefined;
  projects: Project[] | undefined;
  tickets: Ticket[] | undefined; // For blocking ticket selection
  disabled?: boolean;
}
