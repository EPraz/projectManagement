import { Epic } from "./Epic";
import { Project } from "./Project";

export type EpicStatus = {
  id: string;
  name: string;
  position: number;
  color: string;
  projectId?: string;
  project?: Project;
  epics: Epic[];
};
