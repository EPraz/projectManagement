import { Alert, Box, Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import type { GoalTask, LayoutContextProps } from "../../../../types";
import GoalCard from "./GoalCard";
export default function GoalBoard() {
  const {
    sprint,
    setSelectedSprintGoal,
    setOpenEditSprintGoalDialog,
    setOpenDeleteSprintGoalDialog,
    setOpenCreateGoalTaskDialog,
    setSelectedGoalTask,
    setOpenEditGoalTaskDialog,
    setOpenDeleteGoalTaskDialog,
    handleToggleGoalTaskCompletion,
    isGoalTaskPending,
  } = useOutletContext<LayoutContextProps>();
  const goals = sprint?.sprintGoal ?? [];
  const editTask = (task: GoalTask) => {
    setSelectedGoalTask(task);
    setOpenEditGoalTaskDialog(true);
  };
  const removeTask = (task: GoalTask) => {
    setSelectedGoalTask(task);
    setOpenDeleteGoalTaskDialog(true);
  };
  if (!sprint)
    return (
      <Alert severity="info">Choose or create a sprint to plan goals.</Alert>
    );
  return (
    <Box sx={{ minWidth: 0 }}>
      <Box sx={{ mb: 3 }}>
        <Typography component="h2" variant="h3">
          Sprint Goals
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {sprint.name} · {goals.length} goals ·{" "}
          {goals.reduce((sum, goal) => sum + (goal.goalTask?.length ?? 0), 0)}{" "}
          checklist items
        </Typography>
      </Box>
      {!goals.length ? (
        <Alert severity="info">
          No goals added yet. Click "Add New Goal" to create your first sprint
          goal.
        </Alert>
      ) : (
        <Box
          role="region"
          aria-label="Sprint goal cards"
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0,1fr)",
              lg: "repeat(2,minmax(0,1fr))",
            },
            gap: 3,
            alignItems: "start",
          }}
        >
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              edit={() => {
                setSelectedSprintGoal(goal);
                setOpenEditSprintGoalDialog(true);
              }}
              remove={() => {
                setSelectedSprintGoal(goal);
                setOpenDeleteSprintGoalDialog(true);
              }}
              addTask={() => {
                setSelectedSprintGoal(goal);
                setOpenCreateGoalTaskDialog(true);
              }}
              editTask={editTask}
              removeTask={removeTask}
              toggleTask={handleToggleGoalTaskCompletion}
              isTaskPending={isGoalTaskPending}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
