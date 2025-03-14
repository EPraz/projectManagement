import { useState } from "react";
import { useSnackbar } from "../../context/snackbarContext";
import { useApi, useAuth } from "../../context";
import { Ticket } from "../../types";

export const useDeleteTicket = () => {
  const { apiUrl } = useApi();
  const { accessToken } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const deleteTicket = async (data: Partial<Ticket>): Promise<boolean> => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/tickets/${data.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete ticket");

      const apiResponse: boolean = await response.json();
      showSnackbarMessage("Ticket deleted successfully", "success");
      return apiResponse;
    } catch (error) {
      console.error("Error deleting ticket:", error);
      showSnackbarMessage("Failed to delete ticket", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteTicket, loading };
};
