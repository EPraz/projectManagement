import { Role } from "../../constants";
import { PairProgramming } from "./PairProgramming";
import { ProjectUser } from "./ProjectUser";
import { Ticket } from "./Ticket";

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role?: Role;
  project?: ProjectUser[];
  createdAt?: string;
  updatedAt?: string;
  tickets?: Ticket[];
  pairProgramming?: PairProgramming[];
  isVerified?: boolean;
  refreshToken?: string;
};
