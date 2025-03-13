import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Sprint, SprintContextProps } from "../../types";
import { useProject } from "../projectContext";
import { Loading } from "../../components";
import { useSocketSprints } from "../../hooks";

const SprintContext = createContext<SprintContextProps | undefined>(undefined);

export const SprintProvider = ({ children }: { children: ReactNode }) => {
  const {
    project,
    loading: projectLoading,
    listOfSprints,
    setListOfSprints,
  } = useProject();
  const {
    useSocketSprintCreate,
    useSocketSprintDelete,
    useSocketSprintUpdate,
  } = useSocketSprints();
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [loadingSprint, setLoadingSprint] = useState(true);

  //  Memoriza `project` para evitar renders innecesarios
  const projectData = useMemo(() => project, [project]);

  const settingSprint = () => {
    const storedSprintId = localStorage.getItem("selectedSprintId");
    const lastSelectedSprint = projectData?.sprints.find(
      (s) => s.id === storedSprintId
    );
    const today = new Date();
    const activeSprint = projectData?.sprints.find(
      (s) =>
        s.startDate &&
        s.endDate &&
        new Date(s.startDate) <= today &&
        new Date(s.endDate) >= today
    );
    setSprint(
      lastSelectedSprint || activeSprint || projectData?.sprints[0] || null
    );
  };
  //  Manejo del Sprint Seleccionado
  useEffect(() => {
    if (projectLoading || !projectData) return;
    setLoadingSprint(true);

    // Si el proyecto no tiene sprints, limpiamos el estado
    if (!projectData || projectData.sprints.length === 0) {
      setSprint(null);
      setLoadingSprint(false);
      return;
    }

    // Intentamos recuperar el último Sprint seleccionado
    settingSprint();
    setLoadingSprint(false);
  }, [projectData, projectLoading]);

  //  Guardar el Sprint seleccionado en `localStorage`
  useEffect(() => {
    if (sprint) {
      localStorage.setItem("selectedSprintId", sprint.id);
    }
  }, [sprint]);

  const updateListOfSprints = useCallback(
    (updatedSprint: Sprint) => {
      setListOfSprints((prev) =>
        prev.map((t) => (t.id === updatedSprint.id ? updatedSprint : t))
      );
    },
    [setListOfSprints]
  );

  const addOnListOfSprints = useCallback(
    (newSprint: Sprint) => {
      setListOfSprints((prev) => {
        if (prev.find((t) => t.id === newSprint.id)) {
          return prev;
        }
        return [...prev, newSprint];
      });
    },
    [setListOfSprints]
  );

  const removeSprintFromState = useCallback(
    (sprintId: Sprint["id"]) => {
      setListOfSprints((prev) => prev.filter((t) => t.id !== sprintId));
      if (sprint?.id === sprintId) {
        settingSprint();
      }
    },
    [setListOfSprints, sprint, settingSprint]
  );

  useSocketSprintUpdate((data) => updateListOfSprints(data));
  useSocketSprintCreate((data) => addOnListOfSprints(data));
  useSocketSprintDelete((data) => removeSprintFromState(data.id));

  //  Cargando el proyecto
  if (loadingSprint || projectLoading) return <Loading message="Cargando..." />;

  return (
    <SprintContext.Provider
      value={{
        listOfSprints,
        sprint,
        setSprint,
        loadingSprint,
        updateListOfSprints,
        addOnListOfSprints,
        removeSprintFromState,
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
