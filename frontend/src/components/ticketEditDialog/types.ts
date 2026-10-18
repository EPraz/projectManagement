import type { Ticket } from "../../types";
export type TicketFieldProps = {
  draft: Partial<Ticket>;
  errors: Record<string, string>;
  disabled: boolean;
  change: (values: Partial<Ticket>) => void;
};
