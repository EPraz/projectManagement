import { Paper, Typography } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import { Task } from "../../types";
import { formatStatusName } from "../../helpers";

interface TaskProps {
  task: Task;
}

const TaskCard = ({ task }: TaskProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  return (
    <Paper
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        padding: 1,
        marginBottom: 1,
        cursor: "grab",
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : "none",
      }}
    >
      <Typography>{formatStatusName(task.title)}</Typography>
    </Paper>
  );
};

export default TaskCard;
