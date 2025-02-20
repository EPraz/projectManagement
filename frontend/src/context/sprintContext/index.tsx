import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
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
  const [loadingSprint, setLoadingSprint] = useState(true); // ✅ Para la carga inicial del Sprint
  const [loadingTickets, setLoadingTickets] = useState(false); // ✅ Para la carga de Tickets

  // 🔹 Memorizar `project` para evitar renders innecesarios
  const projectData = useMemo(() => project, [project]);

  // ✅ Sprint inicial solo se ejecuta una vez al montar el componente
  useEffect(() => {
    if (projectLoading || !projectData) return;

    // Si no hay sprints
    if (!projectData || projectData.sprints.length === 0) {
      setSprint(null);
      setLoadingSprint(false);
      return;
    }

    // Buscar el Sprint activo
    const today = new Date();
    const activeSprint = projectData.sprints.find(
      (s) =>
        s.startDate &&
        s.endDate &&
        new Date(s.startDate) <= today &&
        new Date(s.endDate) >= today
    );

    setListOfSprints(projectData.sprints);
    setSprint(activeSprint || projectData.sprints[0]);
    setLoadingSprint(false);
  }, [projectData, projectLoading]);

  // ✅ Cargar Sprints desde el Backend (cuando se llama manualmente)
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

      // 🔹 Verificar si el Sprint actual sigue siendo válido
      if (!sprint || !data.find((s: Sprint) => s.id === sprint.id)) {
        const today = new Date();
        const activeSprint = data.find(
          (s: Sprint) =>
            s.startDate &&
            s.endDate &&
            new Date(s.startDate) <= today &&
            new Date(s.endDate) >= today
        );

        setSprint(activeSprint || data[0] || null);
      }
    } catch (error) {
      console.error("Error loading sprints:", error);
    }
  }, [projectData?.id, apiUrl, sprint]);

  // ✅ Cargar Tickets según el Sprint seleccionado
  const loadTicketsBySprint = useCallback(
    async (sprintId?: string) => {
      const id = sprintId || sprint?.id;
      if (!id) return;
      setLoadingTickets(true); // ✅ Solo afecta la sección de tickets
      try {
        const response = await fetch(`${apiUrl}/tickets?sprintId=${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch tickets");
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Error loading tickets:", error);
      } finally {
        setLoadingTickets(false);
      }
    },
    [sprint, apiUrl]
  );

  useEffect(() => {
    loadTicketsBySprint();
  }, [loadTicketsBySprint]);

  // ✅ Loading solo para el Sprint, no para toda la página
  if (loadingSprint || projectLoading) return <Loading message="Cargando..." />;

  return (
    <SprintContext.Provider
      value={{
        listOfSprints,
        sprint,
        setSprint,
        tickets,
        loadTicketsBySprint,
        loadSprints,
        loadingTickets, // ✅ Loading solo para Tickets
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
