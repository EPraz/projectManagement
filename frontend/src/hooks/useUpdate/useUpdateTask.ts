import { useState } from "react";
// import { useSprint } from "../../context/sprintContext";
import { Task } from "../../types";
import { useSnackbar } from "../../context/snackbarContext";
import { useApi } from "../../context";

export const useUpdateTask = () => {
  const { apiUrl } = useApi();
  // const { loadTicketsBySprint } = useSprint();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const updateTask = async (
    data: Partial<Task>
  ): Promise<Task | null | undefined> => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/tasks/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update task");

      // await loadTicketsBySprint();
      const updatedTask: Task = await response.json();
      showSnackbarMessage("Task updated successfully", "success");
      return updatedTask;
    } catch (error) {
      console.error("Error updating task:", error);
      showSnackbarMessage("Failed to update task", "error");
    } finally {
      setLoading(false);
    }
  };

  return { updateTask, loading };
};
