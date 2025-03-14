import { useState } from "react";
import { useApi, useAuth, useSnackbar } from "../../context";
import { RetroCard } from "../../types";

export const useUpdateRetroCard = () => {
  const { apiUrl } = useApi();
  const { accessToken } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const updateRetroCard = async (
    id: string,
    data: Partial<RetroCard>
  ): Promise<RetroCard | null> => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/retrospectives/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update retro card");
      const updated: RetroCard = await response.json();
      showSnackbarMessage("Retro card updated successfully", "success");
      return updated;
    } catch (error) {
      console.error("Error updating retro card:", error);
      showSnackbarMessage("Failed to update retro card", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateRetroCard, loading };
};
