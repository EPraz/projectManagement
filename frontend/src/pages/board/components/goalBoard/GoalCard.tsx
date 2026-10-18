import {
  Box,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import {
  Add,
  CheckCircleOutline,
  RadioButtonUnchecked,
  DeleteOutline,
  EditOutlined,
} from "@mui/icons-material";
import type { GoalTask, SprintGoal } from "../../../../types";
import { statusConfig } from "./GoalBoard.helpers";
export default function GoalCard({
  goal,
  edit,
  remove,
  addTask,
  editTask,
  removeTask,
  toggleTask,
  isTaskPending,
}: {
  goal: SprintGoal;
  edit: () => void;
  remove: () => void;
  addTask: () => void;
  editTask: (task: GoalTask) => void;
  removeTask: (task: GoalTask) => void;
  toggleTask: (task: GoalTask) => void;
  isTaskPending: (id: string) => boolean;
}) {
  const state = statusConfig[goal.goalsStatus];
  const tasks = goal.goalTask ?? [];
  return (
    <Paper
      component="article"
      aria-label={goal.title}
      variant="outlined"
      sx={{ borderRadius: "12px", minWidth: 0, overflow: "hidden" }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            flexWrap: "wrap",
            mb: 2,
          }}
        >
          <Typography variant="overline" color="primary" sx={{ flex: 1 }}>
            Sprint goal
          </Typography>
          <Chip
            size="small"
            label={state?.label ?? goal.goalsStatus}
            color={state?.color ?? "default"}
          />
          <IconButton aria-label="Edit goal" onClick={edit}>
            <EditOutlined fontSize="small" />
          </IconButton>
          <IconButton aria-label="Delete goal" color="error" onClick={remove}>
            <DeleteOutline fontSize="small" />
          </IconButton>
        </Box>
        <Typography
          component="h3"
          sx={{ fontSize: 21, fontWeight: 600, overflowWrap: "anywhere" }}
        >
          {goal.title}
        </Typography>
        {goal.description && (
          <Typography
            color="text.secondary"
            sx={{ mt: 1.5, overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}
          >
            {goal.description}
          </Typography>
        )}
        <Box
          sx={{
            p: 2,
            mt: 3,
            bgcolor: "background.default",
            borderRadius: "8px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Checklist progress
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {goal.progress ?? 0}%
            </Typography>
          </Box>
          <LinearProgress
            aria-label={`Progress for ${goal.title}`}
            variant="determinate"
            value={goal.progress ?? 0}
            color={state?.color ?? "primary"}
            sx={{ height: 6 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {tasks.filter((task) => task.completed).length} of {tasks.length}{" "}
            checklist items complete
          </Typography>
        </Box>
      </Box>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography component="h4" sx={{ fontSize: 18, fontWeight: 600 }}>
            Checklist
          </Typography>
          <Button startIcon={<Add />} onClick={addTask}>
            Add Task
          </Button>
        </Box>
        {!tasks.length ? (
          <Typography variant="body2" color="text.secondary">
            No tasks added yet
          </Typography>
        ) : (
          <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
            {tasks.map((task) => (
              <Box
                component="li"
                key={task.id}
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "start",
                  py: 1.5,
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <IconButton
                  aria-label={
                    task.completed ? "Mark as incomplete" : "Mark as complete"
                  }
                  aria-pressed={task.completed}
                  disabled={isTaskPending(task.id)}
                  onClick={() => toggleTask(task)}
                  color={task.completed ? "success" : "default"}
                >
                  {task.completed ? (
                    <CheckCircleOutline />
                  ) : (
                    <RadioButtonUnchecked />
                  )}
                </IconButton>
                <Typography
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    pt: 1,
                    fontSize: 16,
                    overflowWrap: "anywhere",
                    textDecoration: task.completed ? "line-through" : "none",
                    color: task.completed ? "text.secondary" : "text.primary",
                  }}
                >
                  {task.title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    flexShrink: 0,
                  }}
                >
                  <IconButton
                    aria-label="Edit task"
                    disabled={isTaskPending(task.id)}
                    onClick={() => editTask(task)}
                  >
                    <EditOutlined fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="Delete task"
                    color="error"
                    disabled={isTaskPending(task.id)}
                    onClick={() => removeTask(task)}
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
