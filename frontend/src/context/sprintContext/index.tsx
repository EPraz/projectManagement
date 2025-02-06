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

const SprintContext = createContext<SprintContextProps | undefined>(undefined);

export const SprintProvider = ({ children }: { children: ReactNode }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const loadSprints = useCallback(async () => {
    if (!projectId) return;
    try {
      const response = await fetch(
        `http://localhost:3000/projects/${projectId}/sprints`
      );
      if (!response.ok) throw new Error("Failed to fetch sprints");
      const data = await response.json();
      console.log("test: ", data);
      setSprints(data);
      if (data.length > 0) setSprints(data[0]); // selecting the recent Sprint per default
    } catch (error) {
      console.log("Error loading sprints: ", error);
    }
  }, [projectId]);

  const loadTickets = useCallback(async () => {
    if (!sprint?.id) return;
    try {
      const response = await fetch(
        `http://localhost:3000/projects/${projectId}/sprints/${sprint.id}/tickets`
      );
      if (!response.ok) throw new Error("Failed to fetch tickets");
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error loading tickets:", error);
    }
  }, [projectId, sprint]);

  useEffect(() => {
    loadSprints();
  }, [loadSprints]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  return (
    <SprintContext.Provider
      value={{ sprint, setSprint, sprints, loadSprints, tickets, loadTickets }}
    >
      {children}
    </SprintContext.Provider>
  );
};

export const useSprint = () => {
  const context = useContext(SprintContext);
  if (!context) throw new Error("useSprint must be used within SprintProvider");
  return context;
};
