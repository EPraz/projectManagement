import { Epic } from "./Epic";
import { FeatureStatus } from "./FeatureStatus";
import { Ticket } from "./Ticket";

export type Feature = {
  id: string;
  title: string;
  description?: string;
  acceptanceCriteria?: string;
  discussion?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  status: FeatureStatus;
  epicId: string;
  epic: Epic;
  tickets: Ticket[];
};
