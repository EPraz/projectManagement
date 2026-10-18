import type { TaskUpdate } from "../../services/workItemUpdates";
import { Task, User } from "../models";

export interface TaskEditDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (task: TaskUpdate) => Promise<boolean>;
  onDelete?: (task: Partial<Task>) => Promise<boolean>;
  users: User[] | undefined;
  disabled?: boolean;
}
