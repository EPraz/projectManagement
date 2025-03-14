import { useState } from "react";
import { useSnackbar } from "../../context/snackbarContext";
import { useApi, useAuth } from "../../context";
import { GoalTask } from "../../types";

export const useDeleteGoalTask = () => {
  const { apiUrl } = useApi();
  const { accessToken } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const deleteGoalTask = async (data: Partial<GoalTask>): Promise<boolean> => {
    setLoading(true);

    try {
      const response = await fetch(
        `${apiUrl}/sprint-goals/goalTask/${data.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete goal task");

      const apiResponse: boolean = await response.json();
      showSnackbarMessage("Goal Task deleted successfully", "success");
      return apiResponse;
    } catch (error) {
      console.error("Error deleting goal task:", error);
      showSnackbarMessage("Failed to delete goal task", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteGoalTask, loading };
};
