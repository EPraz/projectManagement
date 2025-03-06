import { GoalTask, Sprint, SprintGoal } from "../../types";

export const createTaskToSprintGoalHandler =
  (
    createGoalTask: (data: Partial<GoalTask>) => Promise<GoalTask | null>,
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>,
    setOpenCreateGoalTaskDialog: React.Dispatch<React.SetStateAction<boolean>>,
    setLocalSprintGoals: React.Dispatch<React.SetStateAction<SprintGoal[]>>,
    selectedSprintGoal: SprintGoal | null
  ) =>
  async (data: Partial<GoalTask>) => {
    if (!selectedSprintGoal?.id) return;

    const newTask = await createGoalTask({
      ...data,
      goalId: selectedSprintGoal.id,
    });

    if (newTask) {
      setSprint((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          sprintGoal: prev.sprintGoal.map((goal) =>
            goal.id === newTask.goalId
              ? {
                  ...goal,
                  goalTask: goal.goalTask
                    ? [...goal.goalTask, newTask]
                    : [newTask],
                }
              : goal
          ),
        };
      });

      setLocalSprintGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === newTask.goalId
            ? {
                ...goal,
                goalTask: goal.goalTask
                  ? [...goal.goalTask, newTask]
                  : [newTask],
              }
            : goal
        )
      );

      setOpenCreateGoalTaskDialog(false);
    }
  };
