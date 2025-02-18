import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Sprint, SprintContextProps, Ticket } from "../../types";
import { useApi } from "../apiContext";
import { useProject } from "../projectContext";
import { Loading } from "../../components";

const SprintContext = createContext<SprintContextProps | undefined>(undefined);

export const SprintProvider = ({ children }: { children: ReactNode }) => {
  const { apiUrl } = useApi();
  const { project, loading: projectLoading } = useProject();
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [listOfSprints, setListOfSprints] = useState<Sprint[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Memorizar project para evitar renders innecesarios
  const projectData = useMemo(() => project, [project]);
  // 🔹 Evitar doble ejecución del efecto con `useRef`
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current || projectLoading || !projectData) return;
    effectRan.current = true;

    if (!projectData || projectData.sprints.length === 0) {
      setSprint(null);
      setLoading(false);
      return;
    }

    const today = new Date();
    const activeSprint = projectData.sprints.find(
      (s) => new Date(s.startDate) <= today && new Date(s.endDate) >= today
    );

    setListOfSprints(projectData.sprints);
    setSprint(activeSprint || projectData.sprints[0]);
    setLoading(false);
  }, [projectData, projectLoading]);

  const loadSprints = useCallback(async () => {
    if (projectLoading || !projectData?.id) return;
    try {
      const response = await fetch(
        `${apiUrl}/sprints?projectId=${projectData.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch sprints");
      const data = await response.json();

      setListOfSprints(data);

      // 🔹 Verificar si el sprint actual sigue siendo válido
      if (!sprint || !data.find((s: Sprint) => s.id === sprint.id)) {
        const today = new Date();
        const activeSprint = data.find(
          (s: Sprint) =>
            new Date(s.startDate) <= today && new Date(s.endDate) >= today
        );

        setSprint(activeSprint || data[0] || null);
      }
    } catch (error) {
      console.error("Error loading sprints:", error);
    }
  }, [projectData?.id, apiUrl, sprint]);

  useEffect(() => {
    loadSprints();
  }, [loadSprints]);

  const loadTicketsBySprint = useCallback(async () => {
    if (!sprint?.id) return;
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/tickets?sprintId=${sprint.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
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
    loadTicketsBySprint();
  }, [loadTicketsBySprint]);

  if (loading || projectLoading)
    return <Loading message="Cargando sprint y tickets..." />;

  return (
    <SprintContext.Provider
      value={{
        listOfSprints,
        sprint,
        setSprint,
        tickets,
        loadTicketsBySprint,
        loadSprints,
      }}
    >
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
