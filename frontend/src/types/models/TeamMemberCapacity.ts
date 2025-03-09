import { Sprint } from "./Sprint";
import { User } from "./User";

export interface TeamMemberCapacity {
  id: string;
  userId: string;
  user: User;
  sprint: Sprint;
  sprintId: string;
  capacity: number;
  daysOff: number;
  remainingWork: number;
  createdAt: string;
}
