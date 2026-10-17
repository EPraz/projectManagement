import { ApiRequest } from "../../services/apiRequest";

export interface ApiContextType {
  apiUrl: string;
  request: ApiRequest;
}
