import { TableCell, IconButton } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import AddIcon from "@mui/icons-material/Add";

interface Task {
  id: string;
  title: string;
  status: string;
}

interface Ticket {
  id: string;
  title: string;
  status: string;
  tasks: Task[];
}

interface ColumnProps {
  id: string;
  ticketId: string;
  tasks: Task[];
  setTickets: (callback: (prevTickets: Ticket[]) => Ticket[]) => void;
  addTask?: () => void;
}

const Column = ({ id, tasks, addTask }: ColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <TableCell
      ref={setNodeRef}
      sx={{
        borderRight: "1px solid rgba(0, 0, 0, 0.2)",
        width: "20%",
        position: "relative",
      }}
    >
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
      {addTask && (
        <IconButton
          onClick={addTask}
          sx={{
            height: "35px",
            width: "35px",
            border: "1px solid green",
            borderRadius: "8px",
          }}
        >
          <AddIcon />
        </IconButton>
      )}
    </TableCell>
  );
};

export default Column;
