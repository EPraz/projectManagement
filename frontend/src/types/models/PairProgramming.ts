import { Ticket } from "./Ticket";
import { User } from "./User";

export type PairProgramming = {
  id: string;
  ticketId?: number;
  ticket: Ticket;
  userId: User["id"];
  user: User;
};
