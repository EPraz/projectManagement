import { useState } from "react";
import { useApi, useSnackbar } from "../../context";
import { useSprint } from "../../context/sprintContext";
import { Sprint } from "../../types";

export const useCreateSprint = () => {
  const { apiUrl } = useApi();
  const { loadSprints } = useSprint();
  const [loading, setLoading] = useState(false);
  const { showSnackbarMessage } = useSnackbar();

  const createSprint = async (data: Partial<Sprint>) => {
    setLoading(true);
    try {
      console.log("ins");
      const response = await fetch(`${apiUrl}/sprints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          startDate: data.startDate
            ? new Date(data.startDate).toISOString()
            : null,
          endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
          // projectId: "selected_project_id", // Ajusta según el contexto
          // startDate: new Date().toISOString(),
          // endDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(), // 2 semanas
        }),
      });
      console.log(response);
      if (!response.ok) throw new Error("Failed to create sprint");

      const sprint = await response.json();
      await loadSprints(); // 🔄 Refrescar lista de Sprints
      showSnackbarMessage("Sprint created successfully", "success");
      return sprint;
    } catch (error) {
      console.error("Error creating sprint:", error);
      showSnackbarMessage("Failed to create sprint", "error");
    } finally {
      setLoading(false);
    }
  };

  return { createSprint, loading };
};
