import { useState } from "react";
import { useApi, useSnackbar } from "../../context";

export const useDeleteRetroCard = () => {
  const { apiUrl } = useApi();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const deleteRetroCard = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/retrospectives/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to delete retro card");
      showSnackbarMessage("Retro card deleted successfully", "success");
      return true;
    } catch (error) {
      console.error("Error deleting retro card:", error);
      showSnackbarMessage("Failed to delete retro card", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteRetroCard, loading };
};
