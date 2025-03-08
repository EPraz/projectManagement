import { useState } from "react";
import { useApi, useSnackbar } from "../../context";
import { Task } from "../../types";

export const useCreateTask = () => {
  const { apiUrl } = useApi();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const createTask = async (data: Partial<Task>): Promise<Task | null> => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
        }),
      });

      if (!response.ok) throw new Error("Failed to create task");

      const newTask: Task = await response.json();
      showSnackbarMessage("Task created successfully", "success");
      return newTask;
    } catch (error) {
      console.error("Error creating task:", error);
      showSnackbarMessage("Failed to create task", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createTask, loading };
};
