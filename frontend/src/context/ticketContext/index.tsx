import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Ticket } from "../../types";
import { useProject } from "../projectContext";
import { useSprint } from "../sprintContext";
import { Loading } from "../../components";
import { useSocketTickets } from "../../hooks";

type TicketContextProps = {
  tickets: Ticket[];
  allTickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  updateAllTickets: (updatedTicket: Ticket) => void;
  addAllTickets: (newTicket: Ticket) => void;
  removeAllTickets: (ticketId: Ticket["id"]) => void;
  updateListOfTickets: (listofTickets: Ticket[]) => void;
};

const TicketContext = createContext<TicketContextProps | undefined>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const { project, loading: projectLoading } = useProject();
  const { sprint, loadingSprint } = useSprint();
  const { useSocketTicketAdd, useSocketTicketRemove, useSocketTicketUpdate } =
    useSocketTickets();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [_, setLoadingTickets] = useState(false);

  const projectData = useMemo(() => project, [project]);
  const sprintData = useMemo(() => sprint, [sprint]);

  useEffect(() => {
    if (projectLoading || !projectData) return;

    setLoadingTickets(true);
    setAllTickets(projectData.tickets || []);
    setLoadingTickets(false);
  }, [projectData, projectLoading, setLoadingTickets, setAllTickets]);

  useEffect(() => {
    setTickets(allTickets.filter((x) => x.sprintId === sprintData?.id));
  }, [allTickets, sprintData, setTickets]);

  const updateAllTickets = useCallback(
    (updatedTicket: Ticket) => {
      setAllTickets((prev) =>
        prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
      );
    },
    [setAllTickets]
  );

  const updateListOfTickets = useCallback(
    (listofTickets: Ticket[]) => {
      const updatedTickets: Ticket[] = allTickets.map((ticket) => {
        const found = listofTickets.find((x) => x.id === ticket.id);
        return found ? found : ticket;
      });

      setAllTickets(updatedTickets);
    },
    [allTickets, setAllTickets]
  );

  const addAllTickets = useCallback(
    (newTicket: Ticket) => {
      setAllTickets((prev) => {
        if (prev.find((t) => t.id === newTicket.id)) {
          return prev;
        }
        return [...prev, newTicket];
      });
    },
    [setAllTickets]
  );

  const removeAllTickets = useCallback(
    (ticketId: Ticket["id"]) => {
      setAllTickets((prev) => prev.filter((t) => t.id !== ticketId));
    },
    [setAllTickets]
  );

  useSocketTicketUpdate((data) => updateAllTickets(data));
  useSocketTicketAdd((data) => addAllTickets(data));
  useSocketTicketRemove((data) => removeAllTickets(data.id));

  if (loadingSprint || projectLoading) return <Loading />;

  return (
    <TicketContext.Provider
      value={{
        tickets,
        setTickets,
        allTickets,
        updateAllTickets,
        addAllTickets,
        removeAllTickets,
        updateListOfTickets,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTicket = () => {
  const context = useContext(TicketContext);
  if (!context)
    throw new Error("useSprint must be used within a SprintProvider");
  return context;
};
