import { Sprint, Ticket } from "../models";

export interface SprintContextProps {
  sprint: Sprint | null;
  listOfSprints: Sprint[];
  tickets: Ticket[];

  setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>;
  updateSprintInState: (updatedSprint: Sprint | null) => void;
  removeSprintFromState: (sprintId: string) => void;
}
