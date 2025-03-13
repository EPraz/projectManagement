import { Sprint } from "../../types";

//  Delete Sprint Handler
export const deleteSprintHandler =
  (
    deleteSprint: (data: Partial<Sprint>) => Promise<boolean>,
    removeSprintFromState: (sprintId: Sprint["id"]) => void
  ) =>
  async (data: Partial<Sprint>) => {
    if (!data.id) return;
    const success = await deleteSprint(data);

    if (success) removeSprintFromState(data.id);
  };
