import { Sprint } from "../../types";

//  Create Sprint Handler
export const createSprintHandler =
  (
    createSprint: (data: Partial<Sprint>) => Promise<Sprint | null>,
    setSprint: React.Dispatch<React.SetStateAction<Sprint | null>>,
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>,
    sprint: Sprint | null
  ) =>
  async (data: Partial<Sprint>) => {
    const newSprint = await createSprint(data);
    if (newSprint) {
      setSprint(newSprint);
      setOpenDialog(false);
      if (!sprint) setSprint(newSprint);
    }
    return newSprint;
  };
