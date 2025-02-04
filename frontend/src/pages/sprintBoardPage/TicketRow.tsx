import { Paper, Typography, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { TICKET_STATUSES } from "../../constants";

interface TicketProps {
  ticket: { id: string; title: string; status: string };
  changeTicketStatus: (ticketId: string, newStatus: string) => void;
}

const TicketRow = ({ ticket, changeTicketStatus }: TicketProps) => {
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
