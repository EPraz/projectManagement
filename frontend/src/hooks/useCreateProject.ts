import { useState } from "react";
import { useApi } from "../context/apiContext";
import { useSnackbar } from "../context/snackbarContext";

export const useCreateProject = () => {
  const { apiUrl } = useApi();
  const { showMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const createProject = async (title: string, description: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, createdBy: "test-user@example.com" }),
      });

      if (!response.ok) throw new Error("Failed to create project");

      const newProject = await response.json();
      showMessage("Project created successfully!", "success");
      return newProject;
    } catch (error) {
      showMessage("Error creating project", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading };
};
