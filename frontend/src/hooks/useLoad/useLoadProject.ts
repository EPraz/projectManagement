import { useState } from "react";
import { useApi, useAuth, useSnackbar } from "../../context";
import { Project } from "../../types";

export const useLoadProject = () => {
  const { apiUrl } = useApi();
  const { accessToken } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const loadProjects = async (): Promise<Project[] | []> => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/projects/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data: Project[] = await response.json();
      //   showSnackbarMessage("Projects loaded successfully", "success");

      return data;
    } catch (error) {
      console.error("Error loading projects:", error);
      showSnackbarMessage("Failed to load projects. Please try again.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { loadProjects, loading };
};
