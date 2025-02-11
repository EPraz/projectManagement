import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { Sprint, SprintContextProps, Ticket } from "../../types";
import { useApi } from "../apiContext";
import { useProject } from "../projectContext";
import { Loading } from "../../components";

const SprintContext = createContext<SprintContextProps | undefined>(undefined);

export const SprintProvider = ({ children }: { children: ReactNode }) => {
  const { apiUrl } = useApi();
  const { project, loading: projectLoading } = useProject(); // Obtenemos `project` y `loading`
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true); // Loading para el Sprint

  useEffect(() => {
    if (projectLoading) return; // 🔹 Esperamos a que `project` termine de cargar

    if (!project || project.sprints.length === 0) {
      setSprint(null);
      setLoading(false);
      return;
    }

    const today = new Date();
    const activeSprint = project.sprints.find(
      (s) => new Date(s.startDate) <= today && new Date(s.endDate) >= today
    );

    setSprint(activeSprint || project.sprints[0]); // Si no hay Sprint activo, usa el primero
    setLoading(false);
  }, [project, projectLoading]);

  const loadTickets = useCallback(async () => {
    if (!sprint?.id) return;
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/tickets?sprintId=${sprint.id}`);
      if (!response.ok) throw new Error("Failed to fetch tickets");
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error loading tickets:", error);
    } finally {
      setLoading(false);
    }
  }, [sprint, apiUrl]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  if (loading) return <Loading message="Cargando sprint y tickets..." />;

  return (
    <SprintContext.Provider value={{ sprint, setSprint, tickets, loadTickets }}>
      {children}
    </SprintContext.Provider>
  );
};

export const useSprint = () => {
  const context = useContext(SprintContext);
  if (!context)
    throw new Error("useSprint must be used within a SprintProvider");
  return context;
};
