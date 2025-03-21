import { useState } from "react";
import { useApi, useAuth, useSnackbar } from "../../context";
import { Ticket } from "../../types";

export const useCreateTicket = () => {
  const { apiUrl } = useApi();
  const { accessToken } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const createTicket = async (
    data: Partial<Ticket>
  ): Promise<Ticket | null> => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...data,
        }),
      });

      if (!response.ok) throw new Error("Failed to create ticket");

      const newTicket: Ticket = await response.json();
      showSnackbarMessage("Ticket created successfully", "success");
      return newTicket;
    } catch (error) {
      console.error("Error creating ticket:", error);
      showSnackbarMessage("Failed to create ticket", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createTicket, loading };
};
