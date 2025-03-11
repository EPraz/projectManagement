import { Task, User } from "../models";

export interface TaskEditDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (task: Partial<Task>) => void;
  onDelete?: (task: Partial<Task>) => void;
  users: User[] | undefined;
  disabled?: boolean;
}
