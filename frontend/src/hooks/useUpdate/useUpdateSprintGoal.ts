import { useState } from "react";
import { SprintGoal } from "../../types";
import { useSnackbar } from "../../context/snackbarContext";
import { useApi, useAuth } from "../../context";

export const useUpdateSprintGoal = () => {
  const { apiUrl } = useApi();
  const { accessToken } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const updateSprintGoal = async (
    data: Partial<SprintGoal>
  ): Promise<SprintGoal | null> => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/sprint-goals/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update sprint goal");

      const updatedSprint: SprintGoal = await response.json();
      showSnackbarMessage("Sprint Goal updated successfully", "success");
      return updatedSprint;
    } catch (error) {
      console.error("Error updating sprint goal:", error);
      showSnackbarMessage("Failed to update sprint goal", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateSprintGoal, loading };
};
