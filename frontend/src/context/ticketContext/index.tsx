import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { Task, Ticket } from "../../types";
import { mergeConfirmedTaskUpdate } from "../../helpers/tasks/mergeConfirmedTaskUpdate";
import { useProject } from "../projectContext";
import { useSprint } from "../sprintContext";

type TicketContextProps = {
  tickets: Ticket[];
  allTickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  updateAllTickets: (updatedTicket: Ticket) => void;
  addAllTickets: (newTicket: Ticket) => void;
  removeAllTickets: (ticketId: Ticket["id"]) => void;
  updateListOfTickets: (listofTickets: Ticket[]) => void;
  applyTaskUpdate: (task: Task) => void;
};
const TicketContext = createContext<TicketContextProps | undefined>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const { project, setProject } = useProject();
  const { sprint } = useSprint();
  const allTickets = useMemo(() => project?.tickets ?? [], [project?.tickets]);
  const tickets = useMemo(
    () => allTickets.filter((ticket) => ticket.sprintId === sprint?.id),
    [allTickets, sprint?.id],
  );
  const updateAllTickets = useCallback(
    (updated: Ticket) => {
      setProject((current) =>
        !current || (updated.projectId && updated.projectId !== current.id)
          ? current
          : {
              ...current,
              tickets: current.tickets.map((ticket) =>
                ticket.id === updated.id ? updated : ticket,
              ),
            },
      );
    },
    [setProject],
  );
  const applyTaskUpdate = useCallback(
    (task: Task) => {
      setProject(
        (current) =>
          current && {
            ...current,
            tickets: mergeConfirmedTaskUpdate(current.tickets, task),
          },
      );
    },
    [setProject],
  );
  const updateListOfTickets = useCallback(
    (updates: Ticket[]) => {
      setProject(
        (current) =>
          current && {
            ...current,
            tickets: current.tickets.map(
              (ticket) =>
                updates.find((update) => update.id === ticket.id) ?? ticket,
            ),
          },
      );
    },
    [setProject],
  );
  const addAllTickets = useCallback(
    (created: Ticket) => {
      setProject((current) =>
        !current ||
        created.projectId !== current.id ||
        current.tickets.some((ticket) => ticket.id === created.id)
          ? current
          : { ...current, tickets: [...current.tickets, created] },
      );
    },
    [setProject],
  );
  const removeAllTickets = useCallback(
    (id: Ticket["id"]) => {
      setProject(
        (current) =>
          current && {
            ...current,
            tickets: current.tickets.filter((ticket) => ticket.id !== id),
          },
      );
    },
    [setProject],
  );
  const setTickets: TicketContextProps["setTickets"] = useCallback(
    (value) => {
      setProject((current) => {
        if (!current) return current;
        const scoped = current.tickets.filter(
          (ticket) => ticket.sprintId === sprint?.id,
        );
        const next = typeof value === "function" ? value(scoped) : value;
        return {
          ...current,
          tickets: [
            ...current.tickets.filter(
              (ticket) => ticket.sprintId !== sprint?.id,
            ),
            ...next,
          ],
        };
      });
    },
    [setProject, sprint?.id],
  );
  return (
    <TicketContext.Provider
      value={{
        tickets,
        allTickets,
        setTickets,
        updateAllTickets,
        applyTaskUpdate,
        updateListOfTickets,
        addAllTickets,
        removeAllTickets,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTicket = () => {
  const context = useContext(TicketContext);
  if (!context)
    throw new Error("useTicket must be used within a TicketProvider");
  return context;
};
