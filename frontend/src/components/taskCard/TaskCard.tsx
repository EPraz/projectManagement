import React, { memo } from "react";
import { Box, Typography, Tooltip, Avatar } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import {
  DragIndicator as DragIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import type { TaskCardProps } from "../../types";
import {
  DragHandle,
  MetricItem,
  TaskContent,
  TaskFooter,
  TaskHeader,
  TaskMetrics,
  TaskPaper,
  TaskTitle,
} from "./TaskCard.styles";

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const formattedDate = new Date(task.updatedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <TaskPaper
      ref={setNodeRef}
      elevation={0}
      isdragging={isDragging}
      sx={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : "none",
      }}
      onClick={onClick}
    >
      <DragHandle {...attributes} {...listeners}>
        <DragIcon fontSize="small" />
      </DragHandle>

      <TaskContent>
        <TaskHeader>
          <Box sx={{ flex: 1 }}>
            <Tooltip title={task.title} arrow>
              <TaskTitle variant="body2">{task.title}</TaskTitle>
            </Tooltip>

            <TaskMetrics>
              <Tooltip title="Task ID" arrow>
                <MetricItem>
                  <Typography variant="caption" fontFamily="monospace">
                    #{task.id}
                  </Typography>
                </MetricItem>
              </Tooltip>

              <Tooltip title="Last updated" arrow>
                <MetricItem>
                  <TimeIcon fontSize="small" />
                  <Typography variant="caption">{formattedDate}</Typography>
                </MetricItem>
              </Tooltip>
            </TaskMetrics>
          </Box>
        </TaskHeader>

        <TaskFooter>
          {task.assignedUser ? (
            <Tooltip title={`Assigned to ${task.assignedUser.name}`} arrow>
              <Avatar
                src={task.assignedUser.email}
                alt={task.assignedUser.name}
                sx={{
                  width: 24,
                  height: 24,
                  backgroundColor: "secondary.main",
                }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Unassigned" arrow>
              <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
                ?
              </Avatar>
            </Tooltip>
          )}
        </TaskFooter>
      </TaskContent>
    </TaskPaper>
  );
};

export default memo(TaskCard);
