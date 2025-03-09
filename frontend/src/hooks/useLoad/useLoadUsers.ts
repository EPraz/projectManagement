import { useState } from "react";
import { useApi, useSnackbar } from "../../context";
import { User } from "../../types";

export const useLoadUsers = () => {
  const { apiUrl } = useApi();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const loadUsers = async (): Promise<User[] | []> => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/users/`);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data: User[] = await response.json();
      //   showSnackbarMessage("Projects loaded successfully", "success");

      return data;
    } catch (error) {
      console.error("Error loading users:", error);
      showSnackbarMessage("Failed to load users. Please try again.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { loadUsers, loading };
};
