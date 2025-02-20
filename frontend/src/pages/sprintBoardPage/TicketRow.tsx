import { Paper, Typography, Select, MenuItem } from "@mui/material";
import { memo, useState } from "react";
import { Ticket, TicketStatus } from "../../types";

interface TicketRowProps {
  ticket: Ticket;
  onChange: (ticketId: number, newStatus: string) => void;
  ticketStatuses: TicketStatus[] | undefined;
}

const TicketRow = ({ ticket, onChange, ticketStatuses }: TicketRowProps) => {
  const [statusOpen, setStatusOpen] = useState(false);

  const currentStatus = ticketStatuses?.find(
    (status) => status.id === ticket.statusId
  );

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
        value={ticket.statusId}
        renderValue={() => currentStatus?.name}
        onChange={(e) => onChange(ticket.id, e.target.value)}
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

export default memo(TicketRow);
