import { useState } from "react";
import { useSnackbar } from "../../context/snackbarContext";
import { useAuth } from "../../context";
import type { TicketUpdate } from "../../services/workItemUpdates";
import { readWorkItemUpdate } from "../../services/workItemUpdates";
import { Ticket } from "../../types";

export const useUpdateTicket = () => {
  const { request } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const updateTicket = async (data: TicketUpdate): Promise<Ticket | null> => {
    setLoading(true);

    try {
      const response = await request<unknown>(`tickets/${data.id}`, {
        method: "PATCH",
        body: data,
        errorMessage: "Failed to update ticket. Please try again."
      });
      const updatedTicket = readWorkItemUpdate<Ticket>(response, data.id);
      showSnackbarMessage("Ticket updated successfully", "success");
      return updatedTicket;
    } catch (error) {
      showSnackbarMessage(
        error instanceof Error ? error.message : "Failed to update ticket",
        "error"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateTicket, loading };
};
