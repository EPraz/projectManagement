import { Role } from "../../constants";
import { Project } from "./Project";
import { User } from "./User";

export type ProjectUser = {
  id: string;
  userId: string;
  projectId: string;
  role: Role;
  user: User;
  project: Project;
};
