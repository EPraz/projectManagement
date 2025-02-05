import { createContext, useContext, useState, ReactNode } from "react";

interface Sprint {
  id: string;
  name: string;
}

interface SprintContextProps {
  sprint: Sprint | null;
  setSprint: (sprint: Sprint) => void;
}

const SprintContext = createContext<SprintContextProps | undefined>(undefined);

export const SprintProvider = ({ children }: { children: ReactNode }) => {
  const [sprint, setSprint] = useState<Sprint | null>(null);
  return (
    <SprintContext.Provider value={{ sprint, setSprint }}>
      {children}
    </SprintContext.Provider>
  );
};

export const useSprint = () => {
  const context = useContext(SprintContext);
  if (!context) throw new Error("useSprint must be used within SprintProvider");
  return context;
};
