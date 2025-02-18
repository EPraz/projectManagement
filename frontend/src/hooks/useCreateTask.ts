import { useState } from "react";
import { useApi, useProject, useSnackbar, useSprint } from "../context";
import { Task } from "../types";

export const useCreateTask = () => {
  const { apiUrl } = useApi();
  const { project } = useProject();
  const { loadTicketsBySprint } = useSprint();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const createTask = async (data: Partial<Task>) => {
    if (!data.ticketId) return null;

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          statusId: project?.taskStatuses.find((s) => s.name === "TODO")?.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to create task");

      const newTask = await response.json();
      loadTicketsBySprint(); // 🔹 Recargar los tickets solo si la creación es exitosa
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
