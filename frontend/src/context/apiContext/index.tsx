import { createContext, useContext } from "react";
import { API_URL } from "../../constants";
import { ApiContextType } from "../../types";

const ApiContext = createContext<ApiContextType>({ apiUrl: API_URL });

export const useApi = () => useContext(ApiContext);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ApiContext.Provider value={{ apiUrl: API_URL }}>
      {children}
    </ApiContext.Provider>
  );
};
