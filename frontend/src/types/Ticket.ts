import { Task } from "./Task";

export interface Ticket {
  id: string;
  title: string;
  status: string;
  tasks: Task[];
}
