import type { TaskUpdate } from "../../services/workItemUpdates";
import { Task, TaskStatus, Ticket, User } from "../models";

export interface TaskEditDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (task: TaskUpdate) => Promise<boolean>;
  onDelete?: (task: Partial<Task>) => Promise<boolean>;
  users: User[] | undefined;
  statuses?: TaskStatus[];
  parentTicket?: Ticket;
  projectName?: string;
  onBackToTicket?: () => void;
  onCreate?: (task: Partial<Task>) => Promise<boolean>;
  initialValues?: Partial<Task>;
  disabled?: boolean;
}
