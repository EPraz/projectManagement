import { useState } from "react";
import { useSnackbar } from "../../context/snackbarContext";
import { useApi, useAuth } from "../../context";
import { Ticket } from "../../types";

export const useUpdateTicket = () => {
  const { apiUrl } = useApi();
  const { accessToken } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const updateTicket = async (
    data: Partial<Ticket>
  ): Promise<Ticket | null> => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/tickets/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update ticket");

      const updatedTicket: Ticket = await response.json();
      showSnackbarMessage("Ticket updated successfully", "success");
      return updatedTicket;
    } catch (error) {
      console.error("Error updating ticket:", error);
      showSnackbarMessage("Failed to update ticket", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateTicket, loading };
};
