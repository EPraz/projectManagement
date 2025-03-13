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

  // Memoriza project para evitar renders innecesarios
  const projectData = useMemo(() => project, [project]);

  // Función para establecer el sprint actual, envuelta en useCallback
  const settingSprint = useCallback(() => {
    const storedSprintId = localStorage.getItem("selectedSprintId");
    const lastSelectedSprint = listOfSprints.find(
      (s) => s.id === storedSprintId
    );
    const today = new Date();
    const activeSprint = listOfSprints.find(
      (s) =>
        s.startDate &&
        s.endDate &&
        new Date(s.startDate) <= today &&
        new Date(s.endDate) >= today
    );
    setSprint(lastSelectedSprint || activeSprint || listOfSprints[0] || null);
  }, [listOfSprints]);

  // Efecto para establecer el sprint una vez que se carga el proyecto
  useEffect(() => {
    if (projectLoading || !projectData) return;
    if (!projectData.sprints || projectData.sprints.length === 0) {
      setSprint(null);
      setLoadingSprint(false);
      return;
    }
    setLoadingSprint(true);
    settingSprint();
    setLoadingSprint(false);
  }, [projectData, projectLoading, settingSprint]);

  // Guardar el sprint seleccionado en localStorage
  useEffect(() => {
    if (sprint) {
      localStorage.setItem("selectedSprintId", sprint.id);
    }
  }, [sprint]);

  // Ejecutar settingSprint cada vez que listOfSprints cambia
  useEffect(() => {
    settingSprint();
  }, [listOfSprints, settingSprint]);

  // Actualiza la lista de sprints y, si el sprint actual es el que se actualizó, actualízalo también.
  const updateListOfSprints = useCallback(
    (updatedSprint: Sprint) => {
      setListOfSprints((prev) =>
        prev.map((s) => (s.id === updatedSprint.id ? updatedSprint : s))
      );
      setSprint((prevSprint) =>
        prevSprint && prevSprint.id === updatedSprint.id
          ? updatedSprint
          : prevSprint
      );
    },
    [setListOfSprints, setSprint, sprint]
  );

  const addOnListOfSprints = useCallback(
    (newSprint: Sprint) => {
      setListOfSprints((prev) => {
        if (prev.find((s) => s.id === newSprint.id)) {
          return prev;
        }
        return [...prev, newSprint];
      });
    },
    [setListOfSprints]
  );

  const removeSprintFromState = useCallback(
    (sprintId: Sprint["id"]) => {
      setListOfSprints((prev) => prev.filter((s) => s.id !== sprintId));
      if (sprint?.id === sprintId) {
        settingSprint();
      }
    },
    [setListOfSprints, sprint, settingSprint]
  );

  useSocketSprintUpdate((data) => updateListOfSprints(data));
  useSocketSprintCreate((data) => addOnListOfSprints(data));
  useSocketSprintDelete((data) => removeSprintFromState(data.id));

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
