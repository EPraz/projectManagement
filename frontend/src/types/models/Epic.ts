import { EpicStatus } from "./EpicStatus";
import { Feature } from "./Feature";
import { Project } from "./Project";

export type Epic = {
  id: string;
  title: string;
  description?: string;
  acceptanceCriteria?: string;
  discussion?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  status: EpicStatus;
  projectId: string;
  project: Project;
  features: Feature[];
};
