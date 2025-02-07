import { Paper, Typography, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { TICKET_STATUSES } from "../../constants";
import { Ticket } from "../../types";

interface TicketRowProps {
  ticket: Ticket;
  changeTicketStatus: (ticketId: string, newStatus: string) => void;
}

const TicketRow = ({ ticket, changeTicketStatus }: TicketRowProps) => {
  const [statusOpen, setStatusOpen] = useState(false);

  return (
    <Paper
      sx={{
        padding: 1,
        marginBottom: 1,
        cursor: "grab",
      }}
    >
      <Typography>{ticket.title}</Typography>
      <Select
        value={ticket.status}
        onChange={(e) => changeTicketStatus(ticket.id, e.target.value)}
        onOpen={() => setStatusOpen(true)}
        onClose={() => setStatusOpen(false)}
        open={statusOpen}
        size="small"
        fullWidth
      >
        {TICKET_STATUSES.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </Select>
    </Paper>
  );
};

export default TicketRow;
