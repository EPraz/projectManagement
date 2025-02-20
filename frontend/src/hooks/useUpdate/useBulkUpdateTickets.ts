// useBulkUpdateTickets.ts
import { useState } from "react";
import { useApi } from "../../context";
import { Ticket } from "../../types";
import { useSnackbar } from "../../context/snackbarContext";

export const useBulkUpdateTickets = () => {
  const { apiUrl } = useApi();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const bulkUpdateTickets = async (tickets: Partial<Ticket>[]) => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/tickets/bulk-update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tickets),
      });

      if (!response.ok) throw new Error("Failed to update tickets");

      const updatedTickets: Ticket[] = await response.json();
      showSnackbarMessage("Tickets updated successfully", "success");
      return updatedTickets;
    } catch (error) {
      console.error("Error updating tickets:", error);
      showSnackbarMessage("Failed to update tickets", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { bulkUpdateTickets, loading };
};
