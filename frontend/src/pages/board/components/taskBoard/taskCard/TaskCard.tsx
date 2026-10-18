import { memo } from "react";
import {
  Box,
  Button,
  ButtonBase,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { DragIndicator } from "@mui/icons-material";
import { useDraggable } from "@dnd-kit/core";
import type { TaskCardProps } from "../../../../../types";
import { formatStatusName } from "../../../../../helpers";
function TaskCard({
  task,
  onClick,
  draggable = true,
  disabled = false,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id, disabled: disabled || !draggable });
  return (
    <Paper
      ref={setNodeRef}
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: 2,
        minWidth: 0,
        position: "relative",
        zIndex: isDragging ? 6 : "auto",
        opacity: disabled ? 0.6 : 1,
        transform: transform
          ? `translate(${transform.x}px,${transform.y}px)`
          : undefined,
        borderLeft: "3px solid",
        borderLeftColor:
          task.status?.name === "DONE"
            ? "success.main"
            : task.status?.name === "BLOCKED"
              ? "error.main"
              : "primary.main",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <ButtonBase
          onClick={onClick}
          disabled={disabled}
          sx={{ borderRadius: 1, color: "primary.main", fontSize: 14 }}
        >
          #{task.id}
        </ButtonBase>
        <Typography color="text.secondary" variant="body2" sx={{ flex: 1 }}>
          {formatStatusName(task.status?.name ?? "No state")}
        </Typography>
        {draggable && (
          <IconButton
            {...attributes}
            {...listeners}
            aria-label={`Drag task #${task.id}`}
            disabled={disabled}
            size="small"
            sx={{ touchAction: "none", cursor: "grab" }}
          >
            <DragIndicator fontSize="small" />
          </IconButton>
        )}
      </Box>
      <ButtonBase
        onClick={onClick}
        disabled={disabled}
        aria-label={`Open task #${task.id} ${task.title}`}
        sx={{
          display: "block",
          width: "100%",
          textAlign: "left",
          py: 1,
          borderRadius: 1,
        }}
      >
        <Typography
          sx={{ fontWeight: 500, overflowWrap: "anywhere", fontSize: 16 }}
        >
          {task.title}
        </Typography>
      </ButtonBase>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ overflowWrap: "anywhere" }}
      >
        {task.assignedUser?.name ?? "Unassigned"}
      </Typography>
      {task.remainingHours != null && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {task.remainingHours} h remaining
        </Typography>
      )}
      <Button
        size="small"
        onClick={onClick}
        disabled={disabled}
        aria-label={`Change status for task #${task.id}`}
        sx={{ mt: 1, px: 0 }}
      >
        Change status
      </Button>
    </Paper>
  );
}
export default memo(TaskCard);
