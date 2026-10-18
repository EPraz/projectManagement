import { TicketPriority, TicketType } from "../constants";
import { User } from "./models";

export interface FilterProps {
  search?: string;
  priority?: TicketPriority;
  status?: string;
  assignedUser?: User;
  type?: TicketType;
  dueDate?: string;
  isBlocked?: boolean;
}
