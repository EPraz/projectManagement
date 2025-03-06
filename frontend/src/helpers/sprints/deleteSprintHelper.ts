import { Sprint } from "../../types";

//  Delete Sprint Handler
export const deleteSprintHandler =
  (
    deleteSprint: (data: Partial<Sprint>) => Promise<boolean>,
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>
  ) =>
  async (data: Partial<Sprint>) => {
    const success = await deleteSprint(data);
    if (success) setSprint(null);
  };
