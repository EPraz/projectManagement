import { useState } from "react";
import { useApi, useSnackbar } from "../../context";
import { GoalTask } from "../../types";

export const useUpdateGoalTask = () => {
  const { apiUrl } = useApi();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const updateGoalTask = async (
    data: Partial<GoalTask>
  ): Promise<GoalTask | null> => {
    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/sprint-goals/goalTask/${data.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Failed to update task goal");

      const udpatedGoalTask: GoalTask = await response.json();
      showSnackbarMessage("Task Goal updated successfully", "success");
      return udpatedGoalTask;
    } catch (error) {
      console.error("Error updating task goal:", error);
      showSnackbarMessage("Failed to update task goal", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateGoalTask, loading };
};
