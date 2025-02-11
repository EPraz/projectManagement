import { createContext, useContext } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ApiContextType {
  apiUrl: string;
}

const ApiContext = createContext<ApiContextType>({ apiUrl: API_URL });

export const useApi = () => useContext(ApiContext);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ApiContext.Provider value={{ apiUrl: API_URL }}>
      {children}
    </ApiContext.Provider>
  );
};
