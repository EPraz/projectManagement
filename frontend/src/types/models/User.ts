import { Role } from "../../constants";
import { PairProgramming } from "./PairProgramming";
import { Project } from "./Project";
import { Ticket } from "./Ticket";

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role?: Role;
  createdAt?: string;
  updatedAt?: string;
  tickets?: Ticket[];
  pairProgramming?: PairProgramming[];
  isVerified?: boolean;
  refreshToken?: string;
  projects: Project[];
};
