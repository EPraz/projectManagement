import { Sprint } from "../../types";

//  Create Sprint Handler
export const createSprintHandler =
  (
    createSprint: (data: Partial<Sprint>) => Promise<Sprint | null>,
    addOnListOfSprints: (newSprint: Sprint) => void
  ) =>
  async (data: Partial<Sprint>) => {
    const newSprint = await createSprint(data);
    if (newSprint) {
      addOnListOfSprints(newSprint);
    }
  };
