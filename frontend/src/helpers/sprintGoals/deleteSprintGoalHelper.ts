import { Sprint, SprintGoal } from "../../types";

export const deleteSprintGoalHandler =
  (
    deleteSprintGoal: (data: Partial<SprintGoal>) => Promise<boolean>,
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>,
    setLocalSprintGoals: React.Dispatch<React.SetStateAction<SprintGoal[]>>
  ) =>
  async (data: Partial<SprintGoal>) => {
    const success = await deleteSprintGoal(data);

    if (success) {
      setLocalSprintGoals((prev) => prev.filter((goal) => goal.id !== data.id));

      setSprint((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          sprintGoal: prev.sprintGoal.filter((goal) => goal.id !== data.id),
        };
      });
    }
  };
