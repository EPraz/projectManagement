import { createContext, useContext } from "react";
import { API_URL } from "../../constants";
import { ApiContextType } from "../../types";
import { createApiRequest } from "../../services/apiRequest";

const api = { apiUrl: API_URL, request: createApiRequest(API_URL) };
const ApiContext = createContext<ApiContextType>(api);

export const useApi = () => useContext(ApiContext);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
};
