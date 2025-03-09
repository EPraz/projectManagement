import { useState } from "react";
import { useApi, useSnackbar } from "../../context";
import { TeamMemberCapacity } from "../../types";

export const useUpdateTeamMemberCapacity = () => {
  const { apiUrl } = useApi();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const updateTeamMemberCapacity = async (
    id: string,
    data: Partial<TeamMemberCapacity>
  ): Promise<TeamMemberCapacity | null> => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/team-member-capacities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok)
        throw new Error("Failed to update team member capacity");

      const updatedRecord: TeamMemberCapacity = await response.json();
      showSnackbarMessage(
        "Team member capacity updated successfully",
        "success"
      );
      return updatedRecord;
    } catch (error) {
      console.error("Error updating team member capacity:", error);
      showSnackbarMessage("Failed to update team member capacity", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateTeamMemberCapacity, loading };
};
