import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useSnackbar } from "../../context/snackbarContext";
import { readCreatedTicket } from "../../services/workItemUpdates";
import type { Ticket } from "../../types";
export const useCreateTicket = () => {
  const { request } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const createTicket = async (
    data: Partial<Ticket>,
  ): Promise<Ticket | null> => {
    setLoading(true);
    try {
      const response = await request<unknown>("/tickets", {
        method: "POST",
        body: data,
        errorMessage: "Failed to create ticket. Please try again.",
      });
      const ticket = readCreatedTicket(response);
      showSnackbarMessage("Ticket created successfully", "success");
      return ticket;
    } catch (error) {
      showSnackbarMessage(
        error instanceof Error ? error.message : "Failed to create ticket",
        "error",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  return { createTicket, loading };
};
