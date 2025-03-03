import { TaskStatus } from "../models";

export interface StatusConfigProps {
  selectedStatuses: TaskStatus[] | undefined;
  setSelectedStatuses: (statuses: TaskStatus[]) => void;
  items: TaskStatus[] | undefined;
}
