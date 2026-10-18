import { Ticket, TicketStatus } from "../models";

export interface TicketCardProps {
  ticket: Ticket;
  disabled?: boolean;
  onChange: (ticketId: number, newStatus: string) => void;
  ticketStatuses: TicketStatus[] | undefined;
}
