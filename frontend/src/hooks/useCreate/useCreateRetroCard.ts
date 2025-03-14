import { useState } from "react";
import { useApi, useAuth, useSnackbar } from "../../context";
import { RetroCard } from "../../types";

export const useCreateRetroCard = () => {
  const { apiUrl } = useApi();
  const { accessToken } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const createRetroCard = async (
    data: Partial<RetroCard>
  ): Promise<RetroCard | null> => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/retrospectives`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create retrospective card");
      const newCard: RetroCard = await response.json();
      showSnackbarMessage("Retro card created successfully", "success");
      return newCard;
    } catch (error) {
      console.error("Error creating retro card:", error);
      showSnackbarMessage("Failed to create retro card", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createRetroCard, loading };
};
