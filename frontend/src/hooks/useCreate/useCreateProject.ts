import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useSnackbar } from "../../context/snackbarContext";
import type { Project } from "../../types/models/Project";
import { readProject } from "../../services/projectResponse";

export const useCreateProject = () => {
  const { request } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const createProject = async (data: Partial<Project>): Promise<Project> => {
    setLoading(true);
    try {
      const project = readProject(
        await request<unknown>("/projects", {
          method: "POST",
          body: data,
          errorMessage:
            "Could not create the project. Your draft is kept. Please try again."
        })
      );
      showSnackbarMessage("Project created successfully!", "success");
      return project;
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading };
};
