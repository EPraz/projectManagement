import { GoalTask, Sprint, SprintGoal } from "../../types";
import { omitProps } from "../selectPropsHelper";

export const editGoalTaskHandler =
  (
    updateGoalTask: (data: Partial<GoalTask>) => Promise<GoalTask | null>,
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>,
    setLocalSprintGoals: React.Dispatch<React.SetStateAction<SprintGoal[]>>,
    setOpenEditTaskDialog: React.Dispatch<React.SetStateAction<boolean>>,
    selectedGoalTask: GoalTask | null
  ) =>
  async (data: Partial<GoalTask>) => {
    const fusion = { ...selectedGoalTask, ...data };
    const toUpdate = omitProps(fusion, ["goalId"]);

    const updatedTask = await updateGoalTask(toUpdate);

    if (updatedTask) {
      setSprint((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          sprintGoal: prev.sprintGoal.map((goal) =>
            goal.id === updatedTask.goalId
              ? {
                  ...goal,
                  goalTask: goal.goalTask?.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                  ),
                }
              : goal
          ),
        };
      });

      setLocalSprintGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === updatedTask.goalId
            ? {
                ...goal,
                goalTask: goal.goalTask?.map((task) =>
                  task.id === updatedTask.id ? updatedTask : task
                ),
              }
            : goal
        )
      );
      setOpenEditTaskDialog(false);
    }
  };
