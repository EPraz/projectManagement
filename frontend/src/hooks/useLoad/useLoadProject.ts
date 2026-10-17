import { useState } from "react";
import { useAuth, useSnackbar } from "../../context";
import { Project } from "../../types";

export const useLoadProject = () => {
  const { request } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const loadProjects = async (): Promise<Project[] | []> => {
    setLoading(true);
    try {
      const data = await request<Project[]>("/projects/", {
        errorMessage: "Failed to load projects. Please try again.",
      });
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
