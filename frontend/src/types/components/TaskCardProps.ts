import { Task } from "../models";

export interface TaskCardProps {
  task: Task;
  onClick: () => void;
}
