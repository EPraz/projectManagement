import { usePendingWorkItems } from "../usePendingWorkItems";
import { useSnackbar } from "../../context/snackbarContext";
import { useAuth } from "../../context";
import type { TicketUpdate } from "../../services/workItemUpdates";
import { readTicketUpdate } from "../../services/workItemUpdates";
import { Ticket } from "../../types";

export const useUpdateTicket = () => {
  const { request } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const { begin, finish, loading, isPending } = usePendingWorkItems();

  const updateTicket = async (data: TicketUpdate): Promise<Ticket | null> => {
    if (!begin(data.id)) return null;

    try {
      const response = await request<unknown>(`tickets/${data.id}`, {
        method: "PATCH",
        body: data,
        errorMessage: "Failed to update ticket. Please try again."
      });
      const updatedTicket = readTicketUpdate(response, data.id);
      showSnackbarMessage("Ticket updated successfully", "success");
      return updatedTicket;
    } catch (error) {
      showSnackbarMessage(
        error instanceof Error ? error.message : "Failed to update ticket",
        "error"
      );
      return null;
    } finally {
      finish(data.id);
    }
  };

  return { updateTicket, loading, isPending };
};
