import { useState } from "react";
import { useApi } from "../../context/apiContext";
import { useSnackbar } from "../../context";
import { Project } from "../../types";

export const useCreateProject = () => {
  const { apiUrl } = useApi();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const createProject = async (
    data: Partial<Project>
  ): Promise<Project | null> => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          createdBy: "test-user@example.com",
        }),
      });

      if (!response.ok) throw new Error("Failed to create project");

      const newProject: Project = await response.json();
      showSnackbarMessage("Project created successfully!", "success");
      return newProject;
    } catch (error) {
      showSnackbarMessage("Error creating project", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading };
};
