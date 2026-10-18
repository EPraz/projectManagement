import { createContext, useCallback, useContext, ReactNode } from "react";
import { Sprint } from "../../types/models/Sprint";
import { SprintContextProps } from "../../types/contextProps/SprintContextProps";
import { useProject } from "../projectContext";

const SprintContext = createContext<SprintContextProps | undefined>(undefined);

export const SprintProvider = ({ children }: { children: ReactNode }) => {
  const { project, listOfSprints, setListOfSprints, sprint, setSprint } =
    useProject();
  const updateListOfSprints = useCallback(
    (updated: Sprint) => {
      if (updated.projectId !== project?.id) return;
      setListOfSprints((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    },
    [project?.id, setListOfSprints],
  );
  const addOnListOfSprints = useCallback(
    (created: Sprint) => {
      if (created.projectId !== project?.id) return;
      setListOfSprints((current) =>
        current.some((item) => item.id === created.id)
          ? current
          : [...current, created],
      );
    },
    [project?.id, setListOfSprints],
  );
  const removeSprintFromState = useCallback(
    (id: Sprint["id"]) => {
      setListOfSprints((current) => current.filter((item) => item.id !== id));
    },
    [setListOfSprints],
  );
  return (
    <SprintContext.Provider
      value={{
        listOfSprints,
        sprint,
        setSprint,
        loadingSprint: false,
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
