import { TableCell, IconButton } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import AddIcon from "@mui/icons-material/Add";
import { Task } from "../../types";
import TaskCard from "../taskCard/TaskCard";

interface TaskColumnProps {
  // status: string;
  ticketId: number;
  tasks: Task[];
  // setTickets: (callback: (prevTickets: Ticket[]) => Ticket[]) => void;
  addTask?: () => void;
  id: string;
}

const TaskColumn = ({ tasks, addTask, id }: TaskColumnProps) => {
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

export default TaskColumn;
