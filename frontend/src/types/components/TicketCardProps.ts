import type { ReactNode } from "react";
import { Ticket, TicketStatus } from "../models";

export interface TicketCardProps {
  ticket: Ticket;
  disabled?: boolean;
  leadingAction?: ReactNode;
  onChange: (ticketId: number, newStatus: string) => void;
  ticketStatuses: TicketStatus[] | undefined;
}
