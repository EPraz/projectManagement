import { useState } from "react";
import { useApi, useAuth, useSnackbar } from "../../context";
import { TeamMemberCapacity } from "../../types";

export const useCreateTeamMemberCapacity = () => {
  const { apiUrl } = useApi();
  const { accessToken } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const createTeamMemberCapacity = async (
    data: Partial<TeamMemberCapacity>
  ): Promise<TeamMemberCapacity | null> => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/team-member-capacities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok)
        throw new Error("Failed to create team member capacity");

      const newRecord: TeamMemberCapacity = await response.json();
      showSnackbarMessage(
        "Team member capacity created successfully",
        "success"
      );
      return newRecord;
    } catch (error) {
      console.error("Error creating team member capacity:", error);
      showSnackbarMessage("Failed to create team member capacity", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createTeamMemberCapacity, loading };
};
