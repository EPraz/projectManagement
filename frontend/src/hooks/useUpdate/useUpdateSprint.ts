import { useState } from "react";
import { Sprint } from "../../types";
import { useSnackbar } from "../../context/snackbarContext";
import { useApi } from "../../context";

export const useUpdateSprint = () => {
  const { apiUrl } = useApi();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const updateSprint = async (
    data: Partial<Sprint>
  ): Promise<Sprint | null> => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/sprints/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update sprint");

      const updatedSprint: Sprint = await response.json();
      showSnackbarMessage("Sprint updated successfully", "success");
      return updatedSprint;
    } catch (error) {
      console.error("Error updating sprint:", error);
      showSnackbarMessage("Failed to update sprint", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateSprint, loading };
};
