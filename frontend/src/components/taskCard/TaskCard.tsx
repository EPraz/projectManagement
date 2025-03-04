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
      isDragging={isDragging}
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
                sx={{ width: 24, height: 24 }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Unassigned" arrow>
              <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
                ?
              </Avatar>
            </Tooltip>
          )}

          {/* <StyledSelect
            value={task.assignedUser?.id || ""}
            onChange={handleAssigneeChange}
            onClick={handleSelectClick}
            onOpen={() => setSelectOpen(true)}
            onClose={() => setSelectOpen(false)}
            open={selectOpen}
            displayEmpty
            size="small"
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <Typography variant="caption" color="text.secondary">
                    Assign
                  </Typography>
                )
              }
              const selectedUser = users.find((user) => user.id === selected)
              return <Typography variant="caption">{selectedUser?.name || "Assigned"}</Typography>
            }}
          >
            <MenuItem value="">
              <em>Unassigned</em>
            </MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar src={user.email} alt={user.name} sx={{ width: 20, height: 20 }} />
                  <Typography variant="body2">{user.name}</Typography>
                </Box>
              </MenuItem>
            ))}
          </StyledSelect> */}

          {/* {task.status && (
            <Chip
              label={formatStatusName(task.status.name)}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.75rem",
                backgroundColor: alpha(task.status.color || "#9e9e9e", 0.1),
                color: task.status.color || "text.secondary",
                fontWeight: 500,
              }}
            />
          )} */}
        </TaskFooter>
      </TaskContent>
    </TaskPaper>
  );
};

export default memo(TaskCard);
