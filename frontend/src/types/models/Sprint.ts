import { SprintGoalStatus } from "../../constants";
import { Project } from "./Project";
import { Ticket } from "./Ticket";

export type Sprint = {
  id: string;
  name: string;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  projectId: string;
  project: Project;
  tickets: Ticket[];
  createdAt: string;
  updatedAt: string;
  sprintGoal: SprintGoal[];
};

export type CreateSprintFormData = {
  name: string;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
};

export interface GoalTask {
  id: string;
  goalId: string;
  title: string;
  completed: boolean;
}

export interface SprintGoal {
  id: string;
  sprintId?: string;
  title: string;
  description?: string;
  progress?: number;
  goalsStatus: SprintGoalStatus;
  goalTask?: GoalTask[];
  createdAt: string;
  updatedAt?: string;
  // createdBy?: string;
}
