import React from "react";
import { useDroppable } from "@dnd-kit/core";
import AddIcon from "@mui/icons-material/Add";
import { Task, TaskColumnProps } from "../../../../../types";
import TaskCard from "../taskCard/TaskCard";
import { memo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AddTaskButton,
  BodyCellTask,
  TaskContainer,
} from "../TaskBoard.styles";

const TaskColumn: React.FC<TaskColumnProps> = ({ tasks, addTask, id }) => {
  const { setNodeRef } = useDroppable({ id });
  const [_, setSearchParams] = useSearchParams();

  const handleOpenEdit = (task: Task) => {
    setSearchParams(
      { tab: "board", taskId: task.id.toString() },
      { replace: true }
    );
  };

  return (
    <BodyCellTask ref={setNodeRef}>
      <TaskContainer>
        {tasks?.map((task) => (
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
    </BodyCellTask>
  );
};

export default memo(TaskColumn);
