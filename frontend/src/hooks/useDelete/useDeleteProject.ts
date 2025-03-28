import { useState } from "react";
import { useSnackbar } from "../../context/snackbarContext";
import { useApi, useAuth } from "../../context";
import { Project } from "../../types";

export const useDeleteProject = () => {
  const { apiUrl } = useApi();
  const { accessToken } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const deleteProject = async (data: Partial<Project>): Promise<boolean> => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/projects/${data.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete project");

      const apiResponse: boolean = await response.json();
      showSnackbarMessage("Project deleted successfully", "success");
      return apiResponse;
    } catch (error) {
      console.error("Error deleting project:", error);
      showSnackbarMessage("Failed to delete project", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteProject, loading };
};
