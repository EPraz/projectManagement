import { usePendingWorkItems } from "../usePendingWorkItems";
import { Task } from "../../types";
import { useSnackbar } from "../../context/snackbarContext";
import { useAuth } from "../../context";
import type { TaskUpdate } from "../../services/workItemUpdates";
import { readTaskUpdate } from "../../services/workItemUpdates";

export const useUpdateTask = () => {
  const { request } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const { begin, finish, loading, isPending } = usePendingWorkItems();

  const updateTask = async (data: TaskUpdate): Promise<Task | null> => {
    if (!begin(data.id)) return null;

    try {
      const response = await request<unknown>(`tasks/${data.id}`, {
        method: "PATCH",
        body: data,
        errorMessage: "Failed to update task. Please try again."
      });
      const updatedTask = readTaskUpdate(response, data.id);
      showSnackbarMessage("Task updated successfully", "success");
      return updatedTask;
    } catch (error) {
      showSnackbarMessage(
        error instanceof Error ? error.message : "Failed to update task",
        "error"
      );
      return null;
    } finally {
      finish(data.id);
    }
  };

  return { updateTask, loading, isPending };
};
