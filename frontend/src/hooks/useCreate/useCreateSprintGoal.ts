import { useState } from "react";
import { useApi, useAuth, useSnackbar } from "../../context";
import { SprintGoal } from "../../types";

export const useCreateSprintGoal = () => {
  const { apiUrl } = useApi();
  const { accessToken } = useAuth();

  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const createSprintGoal = async (
    data: Partial<SprintGoal>
  ): Promise<SprintGoal | null> => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/sprint-goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...data,
        }),
      });

      if (!response.ok) throw new Error("Failed to create goal");

      const newSprintGoal: SprintGoal = await response.json();
      showSnackbarMessage("Sprint Goal created successfully", "success");
      return newSprintGoal;
    } catch (error) {
      console.error("Error creating goal:", error);
      showSnackbarMessage("Failed to create goal", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createSprintGoal, loading };
};
