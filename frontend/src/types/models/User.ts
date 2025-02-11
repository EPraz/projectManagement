import { Role } from "../../constants";
import { ProjectUser } from "./ProjectUser";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  project: ProjectUser[];
  createdAt: string;
  updatedAt: string;
};
