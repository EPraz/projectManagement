import { Task } from "../models";

export interface TaskColumnProps {
  ticketId: number;
  tasks: Task[];
  addTask?: () => void;
  id: string;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setOpenEditTaskDialog: React.Dispatch<React.SetStateAction<boolean>>;
}
