import { useState } from "react";
import { useApi, useAuth, useSnackbar } from "../../context";
import { RetroCard } from "../../types";

export const useGetRetroCards = () => {
  const { apiUrl } = useApi();
  const { accessToken } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const getRetroCards = async (
    sprintId?: string
  ): Promise<RetroCard[] | null> => {
    setLoading(true);
    try {
      const url = sprintId
        ? `${apiUrl}/retrospectives?sprintId=${sprintId}`
        : `${apiUrl}/retrospectives`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch retro cards");
      const cards: RetroCard[] = await response.json();
      return cards;
    } catch (error) {
      console.error("Error fetching retro cards:", error);
      showSnackbarMessage("Failed to fetch retro cards", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getRetroCards, loading };
};
