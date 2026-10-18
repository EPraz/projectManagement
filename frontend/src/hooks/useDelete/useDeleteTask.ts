import { usePendingWorkItems } from "../usePendingWorkItems";
import { useSnackbar } from "../../context/snackbarContext";
import { useAuth } from "../../context";
import type { Task } from "../../types";

export const useDeleteTask = () => {
  const { request } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const { begin, finish, loading, isPending } = usePendingWorkItems();

  const deleteTask = async (data: Partial<Task>): Promise<boolean> => {
    if (!begin(data.id)) return false;
    try {
      const confirmed = await request<unknown>(`tasks/${data.id}`, {
        method: "DELETE",
        errorMessage: "Failed to delete task. Please try again."
      });
      if (confirmed !== true)
        throw new Error(
          "The server did not confirm deletion. Please try again."
        );
      showSnackbarMessage("Task deleted successfully", "success");
      return true;
    } catch (error) {
      showSnackbarMessage(
        error instanceof Error ? error.message : "Failed to delete task",
        "error"
      );
      return false;
    } finally {
      finish(data.id);
    }
  };
  return { deleteTask, loading, isPending };
};
