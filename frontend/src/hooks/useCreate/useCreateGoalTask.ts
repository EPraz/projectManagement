import { useState } from "react";
import { useApi, useSnackbar } from "../../context";
import { GoalTask } from "../../types";

export const useCreateGoalTask = () => {
  const { apiUrl } = useApi();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const createGoalTask = async (
    data: Partial<GoalTask>
  ): Promise<GoalTask | null> => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/sprint-goals/goalTask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create task goal");

      const newGoalTask = await response.json();
      showSnackbarMessage("Task Goal created successfully", "success");
      return newGoalTask;
    } catch (error) {
      console.error("Error creating task goal:", error);
      showSnackbarMessage("Failed to create task goal", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createGoalTask, loading };
};
