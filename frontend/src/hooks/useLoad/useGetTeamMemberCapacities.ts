import { useState } from "react";
import { useApi, useSnackbar } from "../../context";
import { TeamMemberCapacity } from "../../types";

export const useGetTeamMemberCapacities = () => {
  const { apiUrl } = useApi();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const getTeamMemberCapacities = async (
    sprintId: string
  ): Promise<TeamMemberCapacity[] | null> => {
    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/team-member-capacities?sprintId=${sprintId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok)
        throw new Error("Failed to fetch team member capacities");
      const records: TeamMemberCapacity[] = await response.json();
      return records;
    } catch (error) {
      console.error("Error fetching team member capacities:", error);
      showSnackbarMessage("Failed to fetch team member capacities", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getTeamMemberCapacities, loading };
};
