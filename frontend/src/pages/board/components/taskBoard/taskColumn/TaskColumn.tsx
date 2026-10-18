import { memo } from "react";
import { Box, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useDroppable } from "@dnd-kit/core";
import { useSearchParams } from "react-router-dom";
import type { Task, TaskColumnProps } from "../../../../../types";
import TaskCard from "../taskCard/TaskCard";
import { BodyCellTask } from "../TaskBoard.styles";
function TaskColumn({
  tasks,
  addTask,
  id,
  ticketId,
  pending,
  isTaskPending,
}: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${ticketId}:${id}`,
    data: { statusName: id },
  });
  const [params, setParams] = useSearchParams();
  const open = (task: Task) => {
    const next = new URLSearchParams(params);
    next.set("taskId", String(task.id));
    next.delete("ticketId");
    next.delete("ticketTab");
    setParams(next, { replace: true });
  };
  return (
    <BodyCellTask
      ref={setNodeRef}
      data-task-state={id}
      data-ticket-id={ticketId}
      sx={{ bgcolor: isOver ? "action.selected" : undefined }}
    >
      <Box sx={{ display: "grid", gap: 1.5 }}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            disabled={pending || isTaskPending(task.id)}
            onClick={() => open(task)}
          />
        ))}
      </Box>
      {addTask && (
        <Button
          size="small"
          startIcon={<Add />}
          onClick={addTask}
          disabled={pending}
          aria-label={`Add task to ticket #${ticketId}`}
          sx={{ mt: 2 }}
        >
          Add task
        </Button>
      )}
    </BodyCellTask>
  );
}
export default memo(TaskColumn);
