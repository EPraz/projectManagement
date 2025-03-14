import { useState } from "react";
import { useApi, useAuth, useSnackbar } from "../../context";
import { User } from "../../types";

export const useLoadUsers = () => {
  const { apiUrl } = useApi();
  const { accessToken } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const loadUsers = async (): Promise<User[] | []> => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/users/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
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
