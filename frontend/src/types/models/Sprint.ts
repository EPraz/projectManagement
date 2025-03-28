import { SprintGoalStatus } from "../../constants";
import { Project } from "./Project";
import { RetroCard } from "./RetroCard";
import { TeamMemberCapacity } from "./TeamMemberCapacity";
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
  createdBy: string;
  updatedAt: string;
  sprintGoal: SprintGoal[];
  teamMemberCapacities?: TeamMemberCapacity[];
  retroCard?: RetroCard[];
};

export type CreateSprintFormData = {
  name: string;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  projectId?: string;
  createdBy: string;
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
