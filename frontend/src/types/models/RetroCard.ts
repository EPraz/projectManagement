import { RetroTypes } from "../../constants";
import { Sprint } from "./Sprint";
import { User } from "./User";

export type RetroCard = {
  id: string;
  content: string;
  type: RetroTypes;
  likes: number;
  timestamp: string;
  authorId: string;
  author: User;
  sprintId: string;
  sprint: Sprint;
  likedBy: string[];
};
