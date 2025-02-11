import { Paper, Typography, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { Ticket, TicketStatus } from "../../types";

interface TicketRowProps {
  ticket: Ticket;
  changeTicketStatus: (ticketId: number, newStatus: string) => void;
  ticketStatuses: TicketStatus[] | undefined;
}

const TicketRow = ({
  ticket,
  changeTicketStatus,
  ticketStatuses,
}: TicketRowProps) => {
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
        value={ticket.status.id}
        renderValue={() => ticket.status.name}
        onChange={(e) => changeTicketStatus(ticket.id, e.target.value)}
        onOpen={() => setStatusOpen(true)}
        onClose={() => setStatusOpen(false)}
        open={statusOpen}
        size="small"
        fullWidth
      >
        {ticketStatuses?.map((status) => (
          <MenuItem key={status.id} value={status.id}>
            {status.name}
          </MenuItem>
        ))}
      </Select>
    </Paper>
  );
};

export default TicketRow;
