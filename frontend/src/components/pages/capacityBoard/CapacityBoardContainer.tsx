import { useState, useEffect, useCallback, useMemo } from "react";

import { BoardContainer } from "./CapacityBoard.styles";
import { TeamMemberCapacity, User } from "../../../types";
import {
  useGetTeamMemberCapacities,
  useCreateTeamMemberCapacity,
  useUpdateTeamMemberCapacity,
  useDeleteTeamMemberCapacity,
} from "../../../hooks";
import { useProject, useSprint } from "../../../context";
import {
  DeleteConfirmationModal,
  DialogForm,
  Portal,
} from "../../../components";
import { teamMemberCapacitySchema } from "../../../validations";
import CapacityBoardHeader from "./CapacityBoardHeader";
import CapacityBoardEmptyState from "./CapacityBoardEmptyState";
import CapacityBoardTable from "./CapacityBoardTable";
import {
  createFormSubmitHandler,
  deleteFormSubmitHandler,
  editFormSubmitHandler,
} from "./CapacityBoard.helpers";

export type FormDataProps = {
  userId: string;
  capacity: number;
  daysOff: number;
  remainingWork: number;
};

const CapacityBoardContainer = () => {
  const { project } = useProject();
  const { sprint, updateSprintInState } = useSprint();

  const [teamMembers, setTeamMembers] = useState<TeamMemberCapacity[]>(
    sprint?.teamMemberCapacities || []
  );

  // Hooks para API
  const { getTeamMemberCapacities } = useGetTeamMemberCapacities();
  const { createTeamMemberCapacity, loading: creatingCapacity } =
    useCreateTeamMemberCapacity();
  const { updateTeamMemberCapacity, loading: updatingCapacity } =
    useUpdateTeamMemberCapacity();
  const { deleteTeamMemberCapacity } = useDeleteTeamMemberCapacity();

  // Estados para el diálogo (add/edit)
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<TeamMemberCapacity | null>(
    null
  );

  const [formData, setFormData] = useState<FormDataProps>({
    userId: "",
    capacity: 0,
    daysOff: 0,
    remainingWork: 0,
  });

  // Estado para el modal de delete
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [recordToDelete, setRecordToDelete] =
    useState<TeamMemberCapacity | null>(null);

  // Cargar registros de capacidad para el sprint actual
  const fetchCapacities = useCallback(async () => {
    if (!sprint?.id) return;
    const data = await getTeamMemberCapacities(sprint.id);
    if (data) setTeamMembers(data);
  }, [sprint?.id, getTeamMemberCapacities]);

  useEffect(() => {
    fetchCapacities();
  }, [sprint]);

  // Calcular usuarios disponibles: de los usuarios del proyecto, excluir los que ya tienen capacidad
  const availableUsers = useMemo(() => {
    if (!project?.users) return [];
    const assignedIds = new Set(teamMembers.map((m) => m.userId));
    return project.users.filter((u: User) => !assignedIds.has(u.id));
  }, [project?.users, teamMembers]);

  // Handlers para abrir/cerrar el diálogo
  const handleOpenAddDialog = () => {
    setFormData({ userId: "", capacity: 0, daysOff: 0, remainingWork: 0 });
    setEditingRecord(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (record: TeamMemberCapacity) => {
    setEditingRecord(record);
    setFormData({
      userId: record.userId,
      capacity: record.capacity,
      daysOff: record.daysOff,
      remainingWork: record.remainingWork,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRecord(null);
  };

  // Handler para enviar el formulario (create o update)
  const handleFormSubmit = async (data: typeof formData) => {
    if (editingRecord) {
      await editFormSubmitHandler(
        editingRecord,
        data,
        updateTeamMemberCapacity,
        setTeamMembers,
        updateSprintInState,
        handleCloseDialog,
        teamMembers,
        sprint
      );
    } else {
      await createFormSubmitHandler(
        data,
        createTeamMemberCapacity,
        setTeamMembers,
        updateSprintInState,
        handleCloseDialog,
        sprint
      );
    }
  };

  // Handler para borrar un registro
  const handleOpenDeleteModal = (record: TeamMemberCapacity) => {
    setRecordToDelete(record);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    await deleteFormSubmitHandler(
      deleteTeamMemberCapacity,
      recordToDelete,
      setTeamMembers,
      sprint,
      updateSprintInState,
      setOpenDeleteModal,
      setRecordToDelete
    );
  };

  // Calculate summary metrics
  const totalCapacity = useMemo(
    () => teamMembers.reduce((sum, member) => sum + member.capacity, 0),
    [teamMembers]
  );

  const totalRemaining = useMemo(
    () => teamMembers.reduce((sum, member) => sum + member.remainingWork, 0),
    [teamMembers]
  );

  return (
    <BoardContainer>
      <CapacityBoardHeader
        handleOpenAddDialog={handleOpenAddDialog}
        sprint={sprint}
        teamMembers={teamMembers}
        totalCapacity={totalCapacity}
        totalRemaining={totalRemaining}
      />

      {teamMembers.length === 0 ? (
        <CapacityBoardEmptyState
          handleOpenAddDialog={handleOpenAddDialog}
          sprint={sprint}
        />
      ) : (
        <CapacityBoardTable
          handleOpenDeleteModal={handleOpenDeleteModal}
          handleOpenEditDialog={handleOpenEditDialog}
          teamMembers={teamMembers}
        />
      )}

      {openDialog && (
        <Portal>
          <DialogForm
            open={openDialog}
            onClose={handleCloseDialog}
            onSubmit={handleFormSubmit}
            schema={teamMemberCapacitySchema}
            defaultValues={formData}
            title={
              editingRecord
                ? "Edit Team Member Capacity"
                : "Add Team Member Capacity"
            }
            disabled={creatingCapacity || updatingCapacity}
            fieldConfig={{
              userId: {
                label: "User",
                type: "select",
                placeholder: !!editingRecord
                  ? editingRecord.user.name
                  : "Select a user",
                disabled: !!editingRecord,
                options: editingRecord
                  ? [
                      {
                        value: editingRecord.userId,
                        label:
                          project?.users.find(
                            (u: User) => u.id === editingRecord.userId
                          )?.name || "Unknown",
                      },
                    ]
                  : availableUsers.map((u: User) => ({
                      value: u.id,
                      label: `${u.name} (${u.email})`,
                    })),
              },
              capacity: { label: "Capacity (hours)", type: "number" },
              daysOff: { label: "Days Off", type: "number" },
              remainingWork: {
                label: "Remaining Work (hours)",
                type: "number",
              },
            }}
          />
        </Portal>
      )}
      {openDeleteModal && (
        <Portal>
          <DeleteConfirmationModal
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            itemName={recordToDelete?.user?.name || "this record"}
          />
        </Portal>
      )}
    </BoardContainer>
  );
};

export default CapacityBoardContainer;
