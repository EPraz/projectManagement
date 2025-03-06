import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import { Sprint, SprintContextProps } from "../../types";
import { useProject } from "../projectContext";
import { Loading } from "../../components";

const SprintContext = createContext<SprintContextProps | undefined>(undefined);

export const SprintProvider = ({ children }: { children: ReactNode }) => {
  const {
    project,
    loading: projectLoading,
    listOfSprints,
    setListOfSprints,
  } = useProject();
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [loadingSprint, setLoadingSprint] = useState(true);

  //  Memoriza `project` para evitar renders innecesarios
  const projectData = useMemo(() => project, [project]);

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
    const storedSprintId = localStorage.getItem("selectedSprintId");
    const lastSelectedSprint = projectData.sprints.find(
      (s) => s.id === storedSprintId
    );

    // Si no hay uno guardado, usamos el activo
    const today = new Date();
    const activeSprint = projectData.sprints.find(
      (s) =>
        s.startDate &&
        s.endDate &&
        new Date(s.startDate) <= today &&
        new Date(s.endDate) >= today
    );

    setSprint(lastSelectedSprint || activeSprint || projectData.sprints[0]);
    setLoadingSprint(false);
  }, [projectData, projectLoading]);

  //  Guardar el Sprint seleccionado en `localStorage`
  useEffect(() => {
    if (sprint) {
      localStorage.setItem("selectedSprintId", sprint.id);
    }
  }, [sprint]);

  //  Función para actualizar localmente `listOfSprints`
  const updateSprintInState = (updatedSprint: Sprint | null) => {
    if (!updatedSprint) return;
    setListOfSprints((prevSprints) =>
      prevSprints.map((s) => (s.id === updatedSprint.id ? updatedSprint : s))
    );

    if (sprint?.id === updatedSprint.id) {
      setSprint(updatedSprint);
    }
  };

  //  Función para eliminar un sprint de `listOfSprints`
  const removeSprintFromState = (sprintId: string) => {
    setListOfSprints((prevSprints) =>
      prevSprints.filter((s) => s.id !== sprintId)
    );

    if (sprint?.id === sprintId) {
      setSprint(listOfSprints[0] || null);
    }
  };

  //  Cargando el proyecto
  if (loadingSprint || projectLoading) return <Loading message="Cargando..." />;

  return (
    <SprintContext.Provider
      value={{
        listOfSprints,
        sprint,
        setSprint,
        tickets: sprint?.tickets || [], //  Usamos `sprint.tickets` en lugar de llamadas a la API
        updateSprintInState,
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
