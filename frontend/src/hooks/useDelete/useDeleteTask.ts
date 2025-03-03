import { useState } from "react";
import { useSnackbar } from "../../context/snackbarContext";
import { useApi } from "../../context";
import { Task } from "../../types";

export const useDeleteTask = () => {
  const { apiUrl } = useApi();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const deleteTask = async (data: Partial<Task>): Promise<boolean> => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/tasks/${data.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to delete task");

      const apiResponse: boolean = await response.json();
      showSnackbarMessage("Task deleted successfully", "success");
      return apiResponse;
    } catch (error) {
      console.error("Error deleting task:", error);
      showSnackbarMessage("Failed to delete task", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteTask, loading };
};
