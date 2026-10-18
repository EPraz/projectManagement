import { useState } from "react";
import { useSnackbar } from "../../context/snackbarContext";
import { useAuth } from "../../context";
import type { Ticket } from "../../types";

export const useDeleteTicket = () => {
  const { request } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const deleteTicket = async (data: Partial<Ticket>): Promise<boolean> => {
    setLoading(true);
    try {
      const confirmed = await request<unknown>(`tickets/${data.id}`, {
        method: "DELETE",
        errorMessage: "Failed to delete ticket. Please try again."
      });
      if (confirmed !== true)
        throw new Error(
          "The server did not confirm deletion. Please try again."
        );
      showSnackbarMessage("Ticket deleted successfully", "success");
      return true;
    } catch (error) {
      showSnackbarMessage(
        error instanceof Error ? error.message : "Failed to delete ticket",
        "error"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };
  return { deleteTicket, loading };
};
