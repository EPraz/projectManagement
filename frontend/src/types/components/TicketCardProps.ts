import { Ticket, TicketStatus } from "../models";

export interface TicketCardProps {
  ticket: Ticket;
  onChange: (ticketId: number, newStatus: string) => void;
  ticketStatuses: TicketStatus[] | undefined;
}
