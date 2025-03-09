import { useState } from "react";
import { useApi, useSnackbar } from "../../context";
import { User } from "../../types";

export const useCreateProjectUser = () => {
  const { apiUrl } = useApi();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const createProjectUser = async (
    userId: string,
    projectId: string
  ): Promise<User[] | null> => {
    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/projects/${projectId}/users/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Failed to update project member");

      const newUsersList: User[] = await response.json();
      showSnackbarMessage("Project member updated successfully", "success");
      return newUsersList;
    } catch (error) {
      console.error("Error updating project member:", error);
      showSnackbarMessage("Failed to updating project member", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createProjectUser, loading };
};
