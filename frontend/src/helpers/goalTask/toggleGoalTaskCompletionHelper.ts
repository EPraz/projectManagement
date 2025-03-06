import { SprintGoalStatus } from "../../constants";
import { GoalTask, Sprint, SprintGoal } from "../../types";

export const toggleTaskCompletionHandler =
  (
    updateGoalTask: (goalTask: Partial<GoalTask>) => Promise<GoalTask | null>,
    updateSprintGoal: (
      sprintGoal: Partial<SprintGoal>
    ) => Promise<SprintGoal | null>,
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>,
    setLocalSprintGoals: React.Dispatch<React.SetStateAction<SprintGoal[]>>
  ) =>
  async (goalTask: Partial<GoalTask>) => {
    if (!goalTask.id || !goalTask.goalId) return;

    const updatedTask = await updateGoalTask({
      id: goalTask.id,
      completed: !goalTask.completed,
    });

    if (!updatedTask) return;

    let updatedSprintGoal: SprintGoal | null = null;

    setLocalSprintGoals((prevGoals) => {
      return prevGoals.map((goal) => {
        if (goal.id === updatedTask.goalId) {
          const updatedTasks = goal.goalTask?.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          );

          const completedTasks =
            updatedTasks?.filter((task) => task.completed).length || 0;
          const totalTasks = updatedTasks?.length || 0;
          const newProgress =
            totalTasks > 0
              ? Math.round((completedTasks / totalTasks) * 100)
              : 0;
          const newStatus =
            newProgress === 100 ? SprintGoalStatus.COMPLETED : goal.goalsStatus;

          updateSprintGoal({
            id: goal.id,
            progress: newProgress,
            goalsStatus: newStatus,
          }).then((response) => {
            if (response) {
              updatedSprintGoal = response;
              setSprint((prev) => {
                if (!prev) return prev;

                return {
                  ...prev,
                  sprintGoal: prev.sprintGoal.map((g) =>
                    g.id === updatedSprintGoal!.id ? updatedSprintGoal! : g
                  ),
                };
              });

              setLocalSprintGoals((prev) =>
                prev.map((g) =>
                  g.id === updatedSprintGoal!.id ? updatedSprintGoal! : g
                )
              );
            }
          });

          return {
            ...goal,
            goalTask: updatedTasks,
          };
        }
        return goal;
      });
    });
  };
