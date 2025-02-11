import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import { Sprint, SprintContextProps, Ticket } from "../../types";
import { useApi } from "../apiContext";
import { useProject } from "../projectContext"; // Ahora obtenemos datos desde el Project

const SprintContext = createContext<SprintContextProps | undefined>(undefined);

export const SprintProvider = ({ children }: { children: ReactNode }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { apiUrl } = useApi();
  const project = useProject(); // Cargamos el proyecto
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // 🔹 Función para determinar el Sprint activo
  const selectCurrentSprint = () => {
    if (!project || project.sprints.length === 0) return;

    const today = new Date();
    const activeSprint = project.sprints.find(
      (s) => new Date(s.startDate) <= today && new Date(s.endDate) >= today
    );

    setSprint(activeSprint || project.sprints[0]); // Si no hay Sprint activo, toma el primero
  };

  // 🔹 Cargar el Sprint activo al montar el componente
  useEffect(() => {
    selectCurrentSprint();
  }, [project]);

  // 🔹 Cargar los Tickets del Sprint activo
  const loadTickets = useCallback(async () => {
    if (!sprint?.id || !projectId) return;
    try {
      const response = await fetch(`${apiUrl}/tickets?sprintId=${sprint.id}`);
      if (!response.ok) throw new Error("Failed to fetch tickets");
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error loading tickets:", error);
    }
  }, [sprint, projectId, apiUrl]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  return (
    <SprintContext.Provider value={{ sprint, setSprint, tickets, loadTickets }}>
      {children}
    </SprintContext.Provider>
  );
};

export const useSprint = () => {
  const context = useContext(SprintContext);
  if (!context) throw new Error("useSprint must be used within SprintProvider");
  return context;
};
