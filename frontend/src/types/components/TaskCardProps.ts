import { Task } from "../models";

export interface TaskCardProps {
  task: Task;
  draggable?: boolean;
  disabled?: boolean;
  onClick: () => void;
}
