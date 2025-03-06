import { Sprint, SprintGoal } from "../../types";

export const createSprintGoalHandler =
  (
    createSprintGoal: (data: Partial<SprintGoal>) => Promise<SprintGoal | null>,
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>,
    setOpenCreateSprintGoalDialog: React.Dispatch<
      React.SetStateAction<boolean>
    >,
    sprintid: string | undefined,
    setLocalSprintGoals: React.Dispatch<React.SetStateAction<SprintGoal[]>>
  ) =>
  async (data: Partial<SprintGoal>) => {
    const newSprintGoal = await createSprintGoal({
      ...data,
      //   createdBy: "xana@xana.com",
      sprintId: sprintid,
    });

    if (newSprintGoal) {
      setOpenCreateSprintGoalDialog(false);
      setLocalSprintGoals((prev) => [...prev, newSprintGoal]);
      setSprint((prev) => {
        if (!prev) return prev;

        const updatedSprintGoals = Array.isArray(prev.sprintGoal)
          ? [...prev.sprintGoal, newSprintGoal]
          : [newSprintGoal];

        return { ...prev, sprintGoal: updatedSprintGoals };
      });
    }
  };
