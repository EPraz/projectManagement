import { GoalTask, Sprint, SprintGoal } from "../../types";

export const deleteGoalTaskHandler =
  (
    deleteGoalTask: (goalTask: Partial<GoalTask>) => Promise<boolean>,
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>,
    setLocalSprintGoals: React.Dispatch<React.SetStateAction<SprintGoal[]>>,
    setOpenDeleteTaskDialog: React.Dispatch<React.SetStateAction<boolean>>
  ) =>
  async (goalTask: Partial<GoalTask>) => {
    if (!goalTask.id) return;

    const success = await deleteGoalTask(goalTask);

    if (success) {
      setOpenDeleteTaskDialog(false);

      setSprint((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          sprintGoal: prev.sprintGoal.map((goal) =>
            goal.id === goalTask.goalId
              ? {
                  ...goal,
                  goalTask: goal.goalTask?.filter(
                    (task) => task.id !== goalTask.id
                  ),
                }
              : goal
          ),
        };
      });

      setLocalSprintGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalTask.goalId
            ? {
                ...goal,
                goalTask: goal.goalTask?.filter(
                  (task) => task.id !== goalTask.id
                ),
              }
            : goal
        )
      );
    }
  };
