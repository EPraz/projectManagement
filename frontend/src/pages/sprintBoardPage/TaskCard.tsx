import { Paper, Typography } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import { Task } from "../../types";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
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
      <Typography>{task.title}</Typography>
    </Paper>
  );
};

export default TaskCard;
