import { useState } from "react";
import { Task } from "../../types";
import { useSnackbar } from "../../context/snackbarContext";
import { useAuth } from "../../context";
import type { TaskUpdate } from "../../services/workItemUpdates";
import { readWorkItemUpdate } from "../../services/workItemUpdates";

export const useUpdateTask = () => {
  const { request } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const updateTask = async (data: TaskUpdate): Promise<Task | null> => {
    setLoading(true);

    try {
      const response = await request<unknown>(`tasks/${data.id}`, {
        method: "PATCH",
        body: data,
        errorMessage: "Failed to update task. Please try again."
      });
      const updatedTask = readWorkItemUpdate<Task>(response, data.id);
      showSnackbarMessage("Task updated successfully", "success");
      return updatedTask;
    } catch (error) {
      showSnackbarMessage(
        error instanceof Error ? error.message : "Failed to update task",
        "error"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateTask, loading };
};
