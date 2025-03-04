import { Task } from "../models";

export interface TaskColumnProps {
  ticketId: number;
  tasks: Task[];
  addTask?: () => void;
  id: string;
}
