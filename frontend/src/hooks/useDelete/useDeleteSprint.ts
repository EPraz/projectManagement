import { useState } from "react";
import { useSnackbar } from "../../context/snackbarContext";
import { useApi } from "../../context";
import { Sprint } from "../../types";

export const useDeleteSprint = () => {
  const { apiUrl } = useApi();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const deleteSprint = async (data: Partial<Sprint>): Promise<boolean> => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/sprints/${data.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to delete sprint");

      const apiResponse: boolean = await response.json();
      showSnackbarMessage("Sprint deleted successfully", "success");
      return apiResponse;
    } catch (error) {
      console.error("Error deleting sprint:", error);
      showSnackbarMessage("Failed to delete sprint", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteSprint, loading };
};
