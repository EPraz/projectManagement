import { useState } from "react";
import { useApi, useAuth, useSnackbar } from "../../context";

export const useDeleteTeamMemberCapacity = () => {
  const { apiUrl } = useApi();
  const { accessToken } = useAuth();
  const { showSnackbarMessage } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const deleteTeamMemberCapacity = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/team-member-capacities/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok)
        throw new Error("Failed to delete team member capacity");
      showSnackbarMessage(
        "Team member capacity deleted successfully",
        "success"
      );
      return true;
    } catch (error) {
      console.error("Error deleting team member capacity:", error);
      showSnackbarMessage("Failed to delete team member capacity", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteTeamMemberCapacity, loading };
};
