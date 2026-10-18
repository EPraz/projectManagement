import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useSnackbar } from "../../context/snackbarContext";
import { readCreatedTask } from "../../services/workItemUpdates";
import type { Task } from "../../types";
export const useCreateTask = () => {
  const { request } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const createTask = async (data: Partial<Task>): Promise<Task | null> => {
    setLoading(true);
    try {
      const response = await request<unknown>("/tasks", {
        method: "POST",
        body: data,
        errorMessage: "Failed to create task. Please try again.",
      });
      const task = readCreatedTask(response, data.ticketId);
      showSnackbarMessage("Task created successfully", "success");
      return task;
    } catch (error) {
      showSnackbarMessage(
        error instanceof Error ? error.message : "Failed to create task",
        "error",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  return { createTask, loading };
};
