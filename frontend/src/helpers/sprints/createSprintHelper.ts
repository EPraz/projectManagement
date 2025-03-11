import { Sprint } from "../../types";

//  Create Sprint Handler
export const createSprintHandler =
  (
    createSprint: (data: Partial<Sprint>) => Promise<Sprint | null>,
    updateSprintInState: (updatedSprint: Sprint | null) => void
  ) =>
  async (data: Partial<Sprint>) => {
    const newSprint = await createSprint(data);
    if (newSprint) {
      updateSprintInState(newSprint);
    }
  };
