import React from "react";
import { DeleteConfirmationModal, DialogForm, Portal } from "..";
import {
  createSprintSchema,
  createTaskSchema,
  createTicketSchema,
  createSprintGoalSchema,
  editSprintGoalSchema,
  createGoalTaskSchema,
  editGoalTaskSchema,
} from "../../validations";
import { SprintGoalStatus } from "../../constants";
import { DialogsContainerProps } from "../../types";
import { useParams, useSearchParams } from "react-router-dom";
import { formatStatusName } from "../../helpers";
import { useAuth, useProject } from "../../context";
import TaskEditDialog from "../taskEditDialog/TaskEditDialog";
import TicketEditDialog from "../ticketEditDialog/TicketEditDialog";

const DialogsContainer: React.FC<DialogsContainerProps> = ({
  //Tasks
  openTaskDialog,
  setOpenTaskDialog,
  openEditTaskDialog,
  handleCreateTask,
  handleEditTask,
  setOpenEditTaskDialog,
  handleDeleteTask,
  loadingPostTasks,
  loadingUpdateTask,
  loadingDeleteTask,
  selectedTask,
  openDeleteTaskDialog,
  setOpenDeleteTaskDialog,

  //Tickets
  openCreateTicketDialog,
  setOpenCreateTicketDialog,
  openEditTicketDialog,
  setOpenEditTicketDialog,
  handleCreateTicket,
  handleEditTicket,
  handleDeleteTicket,
  loadingPostTickets,
  loadingUpdateTickets,
  loadingDeleteTicket,
  selectedTicket,
  openDeleteTicketDialog,
  setOpenDeleteTicketDialog,

  //Sprint
  listOfSprints,
  openCreateSprintDialog,
  setOpenCreateSprintDialog,
  handleCreateSprint,
  handleDeleteSprint,
  openDeleteSprintDialog,
  setOpenDeleteSprintDialog,
  selectedSprint,
  loadingCreateSprint,
  loadingDeleteSprint,

  // Local States -> SprintGoal -> Goal Board
  openCreateSprintGoalDialog,
  setOpenCreateSprintGoalDialog,
  handleCreateSprintGoal,
  loadingCreateSprintGoal,
  selectedSprintGoal,
  openDeleteSprintGoalDialog,
  setOpenDeleteSprintGoalDialog,
  setSelectedSprintGoal,
  handleDeleteSprintGoal,
  setOpenEditSprintGoalDialog,
  openEditSprintGoalDialog,
  handleEditSprintGoal,
  loadingUpdateSprintGoal,
  openCreateTaskToSprintGoalDialog,
  setOpenCreateGoalTaskDialog,
  handleCreateGoalTask,
  loadingCreateGoalTask,
  loadingUpdateGoalTask,
  openEditGoalTaskDialog,
  selectedGoalTask,
  handleEditGoalTask,
  setOpenEditGoalTaskDialog,
  openDeleteGoalTaskDialog,
  setSelectedGoalTask,
  setOpenDeleteGoalTaskDialog,
  handleDeleteGoalTask,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: projectId } = useParams();
  const { user: currentUser } = useAuth();
  const { project } = useProject();

  const handleCloseCleanUrl = (param: "ticketId" | "taskId") => {
    const currentTab = searchParams.get("tab") || "board";
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(param);
    setSearchParams({ tab: currentTab }, { replace: true });
  };

  return (
    <Portal>
      {/* Create Section */}
      {openCreateTicketDialog && (
        <DialogForm
          open={openCreateTicketDialog}
          title="Create Ticket"
          onClose={() => setOpenCreateTicketDialog(false)}
          onSubmit={handleCreateTicket}
          schema={createTicketSchema}
          disabled={loadingPostTickets}
          defaultValues={{
            title: "",
            description: "",
            createdBy: currentUser?.email,
          }}
          fieldConfig={{
            createdBy: { disabled: true, hidden: true },
          }}
        />
      )}
      {openTaskDialog && (
        <DialogForm
          open={openTaskDialog}
          title="Create Task"
          onClose={() => setOpenTaskDialog(false)}
          onSubmit={handleCreateTask}
          schema={createTaskSchema}
          disabled={loadingPostTasks}
          defaultValues={{
            title: "",
            description: "",
            createdBy: currentUser?.email,
          }}
          fieldConfig={{
            createdBy: { disabled: true, hidden: true },
          }}
        />
      )}
      {openCreateSprintDialog && (
        <DialogForm<Partial<CreateSprintFormData>>
          open={openCreateSprintDialog}
          title="Create Sprint"
          onClose={() => setOpenCreateSprintDialog(false)}
          onSubmit={handleCreateSprint}
          schema={createSprintSchema}
          disabled={loadingCreateSprint || loadingDeleteSprint}
          defaultValues={{
            name: "",
            startDate: new Date().toDateString(),
            endDate: null,
            projectId: projectId,
          }}
          fieldConfig={{
            startDate: {
              label: "startDate",
            },
            endDate: { label: "endDate" },
            projectId: { disabled: true, hidden: true },
          }}
        />
      )}

      {openCreateSprintGoalDialog && (
        <DialogForm
          open={openCreateSprintGoalDialog}
          title="Add Goal"
          onClose={() => setOpenCreateSprintGoalDialog(false)}
          onSubmit={handleCreateSprintGoal}
          schema={createSprintGoalSchema}
          disabled={loadingCreateSprintGoal}
          defaultValues={{
            title: "",
            description: "",
          }}
        />
      )}

      {openCreateTaskToSprintGoalDialog && selectedSprintGoal && (
        <DialogForm
          open={openCreateTaskToSprintGoalDialog}
          title={`Add task for ${selectedSprintGoal?.title}`}
          onClose={() => setOpenCreateGoalTaskDialog(false)}
          onSubmit={handleCreateGoalTask}
          schema={createGoalTaskSchema}
          disabled={loadingCreateGoalTask}
          defaultValues={{
            title: "",
          }}
        />
      )}

      {/* Edit Section */}

      {selectedTask && openEditTaskDialog && (
        <TaskEditDialog
          onSave={handleEditTask}
          open={openEditTaskDialog}
          onClose={() => {
            setOpenEditTaskDialog(false);
            handleCloseCleanUrl("taskId");
          }}
          task={selectedTask}
          onDelete={handleDeleteTask}
          users={project?.users}
          disabled={loadingUpdateTask}
        />
      )}

      {selectedTicket && openEditTicketDialog && (
        <TicketEditDialog
          features={project?.epics.flatMap((x) => x.features)}
          onClose={() => {
            setOpenEditTicketDialog(false);
            handleCloseCleanUrl("ticketId");
          }}
          onSave={handleEditTicket}
          onDelete={handleDeleteTicket}
          open={openEditTicketDialog}
          projects={[]}
          sprints={listOfSprints}
          statuses={project?.ticketStatuses}
          ticket={selectedTicket}
          tickets={project?.tickets}
          users={project?.users}
          disabled={loadingUpdateTickets}
        />
      )}

      {selectedSprintGoal && openEditSprintGoalDialog && (
        <DialogForm
          open={openEditSprintGoalDialog}
          title="Edit Goal"
          onClose={() => {
            setOpenEditSprintGoalDialog(false);
            setSelectedSprintGoal(null);
          }}
          onSubmit={handleEditSprintGoal}
          schema={editSprintGoalSchema}
          disabled={loadingUpdateSprintGoal}
          // defaultValues={selectedSprintGoal}
          defaultValues={{
            title: selectedSprintGoal.title,
            description: selectedSprintGoal.description || "",
            goalsStatus: selectedSprintGoal.goalsStatus,
          }}
          fieldConfig={{
            goalsStatus: {
              type: "select",
              options: [
                {
                  value: SprintGoalStatus.IN_PROGRESS,
                  label: formatStatusName(SprintGoalStatus.IN_PROGRESS),
                },
                {
                  value: SprintGoalStatus.COMPLETED,
                  label: formatStatusName(SprintGoalStatus.COMPLETED),
                },
                {
                  value: SprintGoalStatus.AT_RISK,
                  label: formatStatusName(SprintGoalStatus.AT_RISK),
                },
              ],
            },
          }}
        />
      )}

      {openEditGoalTaskDialog && selectedGoalTask && (
        <DialogForm
          open={openEditGoalTaskDialog}
          title={`Edit task ${selectedGoalTask?.title}`}
          onClose={() => {
            setSelectedGoalTask(null);
            setOpenEditGoalTaskDialog(false);
          }}
          onSubmit={handleEditGoalTask}
          schema={editGoalTaskSchema}
          disabled={loadingUpdateGoalTask}
          defaultValues={{
            title: selectedGoalTask.title,
          }}
        />
      )}

      {/* Delete Section */}

      {selectedTicket && openDeleteTicketDialog && (
        <DeleteConfirmationModal
          open={openDeleteTicketDialog}
          onClose={() => setOpenDeleteTicketDialog(false)}
          onConfirm={() => handleDeleteTicket(selectedTicket)}
          itemName={selectedTicket.title}
          disabled={loadingDeleteTicket}
        />
      )}

      {selectedTask && openDeleteTaskDialog && (
        <DeleteConfirmationModal
          open={openDeleteTaskDialog}
          onClose={() => setOpenDeleteTaskDialog(false)}
          onConfirm={() => handleDeleteTask(selectedTask)}
          itemName={selectedTask.title}
          disabled={loadingDeleteTask}
        />
      )}

      {selectedSprint && openDeleteSprintDialog && (
        <DeleteConfirmationModal
          open={openDeleteSprintDialog}
          onClose={() => setOpenDeleteSprintDialog(false)}
          onConfirm={() => handleDeleteSprint(selectedSprint)}
          itemName={selectedSprint.name}
          disabled={loadingDeleteSprint}
        />
      )}

      {selectedSprintGoal && openDeleteSprintGoalDialog && (
        <DeleteConfirmationModal
          open={openDeleteSprintGoalDialog}
          onClose={() => {
            setOpenDeleteSprintGoalDialog(false);
            setSelectedSprintGoal(null);
          }}
          onConfirm={() => handleDeleteSprintGoal(selectedSprintGoal)}
          itemName={selectedSprintGoal.title}
        />
      )}
      {selectedGoalTask && openDeleteGoalTaskDialog && (
        <DeleteConfirmationModal
          open={openDeleteGoalTaskDialog}
          onClose={() => {
            setOpenDeleteGoalTaskDialog(false);
            setSelectedGoalTask(null);
          }}
          onConfirm={() => handleDeleteGoalTask(selectedGoalTask)}
          itemName={selectedGoalTask.title}
        />
      )}
    </Portal>
  );
};

export default DialogsContainer;
