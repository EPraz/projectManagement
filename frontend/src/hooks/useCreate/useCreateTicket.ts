import { useState } from "react";
import { useApi, useSnackbar } from "../../context";
import { Ticket } from "../../types";

export const useCreateTicket = () => {
  const { apiUrl } = useApi();
  // const { project } = useProject();
  // const { loadTicketsBySprint } = useSprint();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const createTicket = async (data: Partial<Ticket>) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          // statusId: project?.ticketStatuses.find((s) => s.name === "NEW")?.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to create ticket");

      const newTicket = await response.json();
      // await loadTicketsBySprint(); // 🔹 Recargar los tickets solo si la creación es exitosa
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
