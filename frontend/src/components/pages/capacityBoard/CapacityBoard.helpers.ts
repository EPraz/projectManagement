import { Sprint, TeamMemberCapacity } from "../../../types";
import { FormDataProps } from "./CapacityBoardContainer";

export const computeProgress = (member: TeamMemberCapacity) =>
  (member.remainingWork / member.capacity) * 100;

export const computePerDay = (member: TeamMemberCapacity) =>
  (member.capacity - member.remainingWork) / (member.daysOff || 1);

export const editFormSubmitHandler = async (
  editingRecord: TeamMemberCapacity,
  data: FormDataProps,
  updateTeamMemberCapacity: (
    id: string,
    data: Partial<TeamMemberCapacity>
  ) => Promise<TeamMemberCapacity | null>,
  setTeamMembers: (value: React.SetStateAction<TeamMemberCapacity[]>) => void,
  updateSprintInState: (updatedSprint: Sprint | null) => void,
  handleCloseDialog: () => void,
  teamMembers: TeamMemberCapacity[],
  sprint: Sprint | null
) => {
  // Update
  const updated = await updateTeamMemberCapacity(editingRecord.id, {
    capacity: data.capacity,
    daysOff: data.daysOff,
    remainingWork: data.remainingWork,
  });
  if (updated) {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    );
    // Actualizar sprint si es necesario
    if (sprint) {
      const updateSprint: Sprint = {
        ...sprint,
        teamMemberCapacities: teamMembers.map((m) =>
          m.id === updated.id ? updated : m
        ),
      };
      updateSprintInState(updateSprint);
    }
    handleCloseDialog();
  }
};

export const createFormSubmitHandler = async (
  data: FormDataProps,
  createTeamMemberCapacity: (
    data: Partial<TeamMemberCapacity>
  ) => Promise<TeamMemberCapacity | null>,
  setTeamMembers: (value: React.SetStateAction<TeamMemberCapacity[]>) => void,
  updateSprintInState: (updatedSprint: Sprint | null) => void,
  handleCloseDialog: () => void,
  sprint: Sprint | null
) => {
  // Create
  if (!sprint?.id) return;
  const created = await createTeamMemberCapacity({
    userId: data.userId,
    sprintId: sprint.id,
    capacity: data.capacity,
    daysOff: data.daysOff,
    remainingWork: data.remainingWork,
  });
  if (created) {
    setTeamMembers((prev) => [...prev, created]);
    if (sprint) {
      const updateSprint: Sprint = {
        ...sprint,
        teamMemberCapacities: [...(sprint.teamMemberCapacities || []), created],
      };
      updateSprintInState(updateSprint);
    }

    handleCloseDialog();
  }
};

export const deleteFormSubmitHandler = async (
  deleteTeamMemberCapacity: (id: string) => Promise<boolean>,
  recordToDelete: TeamMemberCapacity | null,
  setTeamMembers: (value: React.SetStateAction<TeamMemberCapacity[]>) => void,
  sprint: Sprint | null,
  updateSprintInState: (updatedSprint: Sprint | null) => void,
  setOpenDeleteModal: (value: React.SetStateAction<boolean>) => void,
  setRecordToDelete: (
    value: React.SetStateAction<TeamMemberCapacity | null>
  ) => void
) => {
  if (recordToDelete) {
    const success = await deleteTeamMemberCapacity(recordToDelete.id);
    if (success) {
      setTeamMembers((prev) => prev.filter((m) => m.id !== recordToDelete.id));
      // Actualiza sprint si es necesario
      if (sprint) {
        const updateSprint: Sprint = {
          ...sprint,
          teamMemberCapacities: sprint?.teamMemberCapacities?.filter(
            (m) => m.id !== recordToDelete.id
          ),
        };
        updateSprintInState(updateSprint);
      }
    }
    setOpenDeleteModal(false);
    setRecordToDelete(null);
  }
};
