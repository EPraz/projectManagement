import { useState } from "react";
import { useApi, useAuth, useSnackbar } from "../../context";
import { User } from "../../types";

export const useDeleteProjectUser = () => {
  const { apiUrl } = useApi();
  const { accessToken } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const deleteProjectUser = async (
    userId: string,
    projectId: string
  ): Promise<User[] | null> => {
    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/projects/${projectId}/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to remove member");

      const newUsersList: User[] = await response.json();
      showSnackbarMessage("Member removed successfully", "success");
      return newUsersList;
    } catch (error) {
      console.error("Error removing member:", error);
      showSnackbarMessage("Failed to remove member", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { deleteProjectUser, loading };
};
