import { Feature } from "./Feature";
import { Project } from "./Project";

export type FeatureStatus = {
  id: string;
  name: string;
  position: number;
  color: string;
  projectId?: string;
  project?: Project;
  features: Feature[];
};
