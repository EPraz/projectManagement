import { useState } from "react";
import { useSnackbar } from "../../context/snackbarContext";
import { useApi, useAuth } from "../../context";
import { SprintGoal } from "../../types";

export const useDeleteSprintGoal = () => {
  const { apiUrl } = useApi();
  const { accessToken } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const deleteSprintGoal = async (
    data: Partial<SprintGoal>
  ): Promise<boolean> => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/sprint-goals/${data.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete sprint goal");

      const apiResponse: boolean = await response.json();
      showSnackbarMessage("Sprint Goal deleted successfully", "success");
      return apiResponse;
    } catch (error) {
      console.error("Error deleting sprint goal:", error);
      showSnackbarMessage("Failed to delete sprint goal", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteSprintGoal, loading };
};
