import { Sprint, SprintGoal } from "../../types";
import { omitProps } from "../selectPropsHelper";

export const editSprintGoalHandler =
  (
    updateSprintGoal: (
      data: Partial<SprintGoal>
    ) => Promise<SprintGoal | null | undefined>,
    selectedSprintGoal: SprintGoal | null,
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>,
    setOpenEditSprintGoalDialog: React.Dispatch<React.SetStateAction<boolean>>,
    setLocalSprintGoals: React.Dispatch<React.SetStateAction<SprintGoal[]>>
  ) =>
  async (data: Partial<SprintGoal>) => {
    const fusion = { ...selectedSprintGoal, ...data };
    const toUpdate = omitProps(fusion, [
      "createdAt",
      "updatedAt",
      "sprintId",
      "goalTask",
    ]);

    const updatedSprintGoal = await updateSprintGoal(toUpdate);

    if (updatedSprintGoal) {
      setSprint((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          sprintGoal: prev.sprintGoal.map((x) =>
            x.id === updatedSprintGoal.id ? updatedSprintGoal : x
          ),
        };
      });

      setLocalSprintGoals((prev) =>
        prev.map((t) => (t.id === updatedSprintGoal.id ? updatedSprintGoal : t))
      );

      setOpenEditSprintGoalDialog(false);
    }
  };
