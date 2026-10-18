import type { TicketUpdate } from "../../services/workItemUpdates";
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
  onSave: (ticket: TicketUpdate) => Promise<boolean>;
  onDelete?: (ticket: Partial<Ticket>) => Promise<boolean>;
  statuses: TicketStatus[] | undefined;
  users: User[] | undefined;
  sprints: Sprint[] | null;
  features: Feature[] | undefined;
  projects: Project[] | undefined;
  tickets: Ticket[] | undefined; // For blocking ticket selection
  disabled?: boolean;
  projectName?: string;
  initialValues?: Partial<Ticket>;
  onCreate?: (ticket: Partial<Ticket>) => Promise<boolean>;
  initialTab?: number;
  onCreateTask?: () => void;
  onOpenTask?: (task: import("../models").Task) => void;
}
