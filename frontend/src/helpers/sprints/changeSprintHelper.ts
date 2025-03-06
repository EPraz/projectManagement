import { Sprint } from "../../types";

//  Change Sprint Handler
export const changeSprintHandler =
  (
    listOfSprints: Sprint[] | null,
    sprint: Sprint | null,
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>
  ) =>
  async (newSprintId: string) => {
    const newSprint = listOfSprints?.find((s) => s.id === newSprintId);
    if (newSprint && newSprint.id !== sprint?.id) {
      setSprint(newSprint);
      localStorage.setItem("selectedSprintId", newSprint.id);
    }
  };
