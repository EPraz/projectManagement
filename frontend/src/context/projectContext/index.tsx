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
import { Loading } from "../../components";

const ProjectContext = createContext<{
  project: Project | null;
  loading: boolean;
}>({
  project: null,
  loading: false, // 🔹 Cambiamos el default a false para evitar bloqueos
});

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const { projectId } = useParams<{ projectId?: string }>(); // 🔹 Puede ser `undefined`
  const { apiUrl } = useApi();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  const isProjectPage = /^\/projects\/[^/]+/.test(window.location.pathname);

  const loadProject = useCallback(async () => {
    if (!projectId || !isProjectPage) return; // 🔹 No cargamos en páginas sin `projectId`
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error("Error loading project:", error);
    } finally {
      setLoading(false);
    }
  }, [projectId, apiUrl, isProjectPage]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  if (loading) return <Loading message="Cargando proyecto..." />;

  return (
    <ProjectContext.Provider value={{ project, loading }}>
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
