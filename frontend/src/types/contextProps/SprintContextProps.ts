import { Sprint } from "../models";

export interface SprintContextProps {
  sprint: Sprint | null;
  listOfSprints: Sprint[];
  loadingSprint: boolean;

  setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>;

  updateListOfSprints: (updatedSprint: Sprint) => void;
  addOnListOfSprints: (newSprint: Sprint) => void;
  removeSprintFromState: (sprintId: Sprint["id"]) => void;
}
