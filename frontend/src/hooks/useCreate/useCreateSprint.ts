import { useState } from "react";
import { useApi, useSnackbar } from "../../context";
import { Sprint } from "../../types";

//verify if still working after refactor

export const useCreateSprint = () => {
  const { apiUrl } = useApi();
  const [loading, setLoading] = useState(false);
  const { showSnackbarMessage } = useSnackbar();

  const createSprint = async (
    data: Partial<Sprint>
  ): Promise<Sprint | null> => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/sprints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          startDate: data.startDate
            ? new Date(data.startDate).toISOString()
            : null,
          endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
        }),
      });
      if (!response.ok) throw new Error("Failed to create sprint");

      const sprint: Sprint = await response.json();
      showSnackbarMessage("Sprint created successfully", "success");
      return sprint;
    } catch (error) {
      console.error("Error creating sprint:", error);
      showSnackbarMessage("Failed to create sprint", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createSprint, loading };
};
