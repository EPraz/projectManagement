import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import { Project } from "../../types";
import { useApi } from "../apiContext";

const ProjectContext = createContext<Project | null>(null);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { apiUrl } = useApi();
  const [project, setProject] = useState<Project | null>(null);

  const loadProject = useCallback(async () => {
    if (!projectId) return;
    try {
      const response = await fetch(`${apiUrl}/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error("Error loading project:", error);
    }
  }, [projectId, apiUrl]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  return (
    <ProjectContext.Provider value={project}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context)
    throw new Error("useProject must be used within ProjectProvider");
  return context;
};
