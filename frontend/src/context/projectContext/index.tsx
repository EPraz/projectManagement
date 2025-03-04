import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
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
  loading: false,
});

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const { id } = useParams();
  const { apiUrl } = useApi();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  //  Verificar si estamos en una página de proyecto antes de cargar datos
  const isProjectPage = useMemo(
    () => /^\/projects\/[^/]+/.test(window.location.pathname),
    [window.location.pathname]
  );

  const loadProject = useCallback(async () => {
    if (!id || !isProjectPage) return;
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/projects/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch project");
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error("Error loading project:", error);
    } finally {
      setLoading(false);
    }
  }, [id, apiUrl, isProjectPage]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const memoizedProject = useMemo(() => project, [project]);

  if (loading) return <Loading message="Cargando proyecto..." />;

  return (
    <ProjectContext.Provider value={{ project: memoizedProject, loading }}>
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
