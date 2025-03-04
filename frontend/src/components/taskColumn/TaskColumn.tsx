import React from "react";
import { useDroppable } from "@dnd-kit/core";
import AddIcon from "@mui/icons-material/Add";
import { Task, TaskColumnProps } from "../../types";
import TaskCard from "../taskCard/TaskCard";
import { memo } from "react";
import { AddTaskButton, BodyCell, TaskContainer } from "./TaskColumn.styles";

const TaskColumn: React.FC<TaskColumnProps> = ({
  tasks,
  addTask,
  id,
  setSelectedTask,
  setOpenEditTaskDialog,
}) => {
  const { setNodeRef } = useDroppable({ id });

  const handleOpenEdit = (task: Task) => {
    setSelectedTask(task);
    setOpenEditTaskDialog(true);
  };

  return (
    <BodyCell ref={setNodeRef}>
      <TaskContainer>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => handleOpenEdit(task)}
          />
        ))}
      </TaskContainer>

      {addTask && (
        <AddTaskButton onClick={addTask}>
          <AddIcon />
        </AddTaskButton>
      )}
    </BodyCell>
  );
};

export default memo(TaskColumn);
