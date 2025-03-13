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
import { Project, Sprint, Ticket } from "../../types";
import { useApi } from "../apiContext";
import { Loading } from "../../components";

const ProjectContext = createContext<{
  project: Project | null;
  loading: boolean;
  listOfSprints: Sprint[];
  setListOfSprints: React.Dispatch<React.SetStateAction<Sprint[]>>;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
} | null>(null);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const { id } = useParams();
  const { apiUrl } = useApi();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [listOfSprints, setListOfSprints] = useState<Sprint[]>([]);

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
      const data: Project = await response.json();
      setProject(data);
      setListOfSprints(data.sprints);
    } catch (error) {
      console.error("Error loading project:", error);
    } finally {
      setLoading(false);
    }
  }, [id, apiUrl, isProjectPage]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  useEffect(() => {
    setProject((prev) => {
      if (!prev) return prev;
      return { ...prev, sprints: listOfSprints };
    });
  }, [listOfSprints]);

  const memoizedProject = useMemo(() => project, [project]);

  if (loading) return <Loading message="Cargando proyecto..." />;

  return (
    <ProjectContext.Provider
      value={{
        project: memoizedProject,
        loading,
        listOfSprints,
        setListOfSprints,
        setProject,
      }}
    >
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
