import { Project } from "./Project";
import { Task } from "./Task";

export type TaskStatus = {
  id: string;
  name: string;
  position: number;
  color: string;
  projectId?: string;
  project?: Project;
  tasks?: Task[];
};
