import { Paper, Typography } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";

interface TicketProps {
  ticket: { id: string; title: string };
}

const TicketCard = ({ ticket }: TicketProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: ticket.id,
  });

  return (
    <Paper
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        padding: 1,
        margin: 1,
        cursor: "grab",
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : "none",
      }}
    >
      <Typography>{ticket.title}</Typography>
    </Paper>
  );
};

export default TicketCard;
