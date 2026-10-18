import React from "react";
import { DeleteConfirmationModal, DialogForm, Portal } from "..";
import {
  createSprintSchema,
  createSprintGoalSchema,
  editSprintGoalSchema,
  createGoalTaskSchema,
  editGoalTaskSchema,
} from "../../validations";
import { SprintGoalStatus, TicketPriority, TicketType } from "../../constants";
import { CreateSprintFormData, DialogsContainerProps } from "../../types";
import { useParams, useSearchParams } from "react-router-dom";
import { formatStatusName } from "../../helpers";
import { useAuth, useProject, useSprint, useTicket } from "../../context";
import TaskEditDialog from "../taskEditDialog/TaskEditDialog";
import TicketEditDialog from "../ticketEditDialog/TicketEditDialog";

const DialogsContainer: React.FC<DialogsContainerProps> = ({
  //Tasks
  selectedTicketId,
  setSelectedTicketId,
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
  loadingDeleteSprintGoal,
  openCreateTaskToSprintGoalDialog,
  setOpenCreateGoalTaskDialog,
  handleCreateGoalTask,
  loadingCreateGoalTask,
  loadingUpdateGoalTask,
  loadingDeleteGoalTask,
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
  const { sprint } = useSprint();
  const { allTickets } = useTicket();

  const handleCloseCleanUrl = (param: "ticketId" | "taskId") => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(param);
    if (param === "ticketId") newParams.delete("ticketTab");
    setSearchParams(newParams, { replace: true });
  };

  return (
    <Portal>
      {/* Create Section */}
      {openCreateTicketDialog && (
        <TicketEditDialog
          projectName={project?.title}
          open
          ticket={null}
          onClose={() => setOpenCreateTicketDialog(false)}
          onCreate={handleCreateTicket}
          onSave={handleEditTicket}
          statuses={project?.ticketStatuses}
          users={project?.users}
          sprints={listOfSprints}
          features={project?.epics.flatMap((epic) => epic.features)}
          tickets={allTickets}
          projects={[]}
          disabled={loadingPostTickets}
          initialValues={{
            title: "",
            description: "",
            sprintId: sprint?.id,
            statusId: project?.ticketStatuses.find(
              (status) => status.name === "NEW",
            )?.id,
            type: TicketType.PRODUCT_BACKLOG_ITEM,
            priority: TicketPriority.MEDIUM,
            isBlocked: false,
          }}
        />
      )}

      {openTaskDialog && (
        <TaskEditDialog
          open
          task={null}
          onClose={() => setOpenTaskDialog(false)}
          onCreate={handleCreateTask}
          onSave={handleEditTask}
          users={project?.users}
          projectName={project?.title}
          parentTicket={allTickets.find(
            (ticket) => ticket.id === selectedTicketId,
          )}
          initialValues={{ title: "", description: "" }}
          disabled={loadingPostTasks}
        />
      )}

      {openCreateSprintDialog && (
        <DialogForm<Partial<CreateSprintFormData>>
          open={openCreateSprintDialog}
          title="Create Sprint"
          key={projectId}
          onClose={() => setOpenCreateSprintDialog(false)}
          onSubmit={handleCreateSprint}
          schema={createSprintSchema}
          disabled={loadingCreateSprint || loadingDeleteSprint}
          defaultValues={{
            name: "",
            startDate: new Date().toDateString(),
            endDate: null,
            projectId: projectId,
            createdBy: currentUser?.email,
          }}
          fieldConfig={{
            startDate: {
              label: "startDate",
            },
            endDate: { label: "endDate" },
            projectId: { disabled: true, hidden: true },
            createdBy: { disabled: true, hidden: true },
          }}
        />
      )}

      {openCreateSprintGoalDialog && (
        <DialogForm
          open={openCreateSprintGoalDialog}
          title="Add Goal"
          key={sprint?.id}
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
          key={selectedSprintGoal.id}
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
          key={selectedTask.id}
          statuses={project?.taskStatuses}
          projectName={project?.title}
          parentTicket={allTickets.find(
            (ticket) => ticket.id === selectedTask.ticketId,
          )}
          onBackToTicket={() => {
            const params = new URLSearchParams(searchParams);
            params.delete("taskId");
            params.set("ticketId", String(selectedTask.ticketId));
            params.set("ticketTab", "tasks");
            setSearchParams(params);
          }}
          onSave={handleEditTask}
          open={openEditTaskDialog}
          onClose={() => {
            setOpenEditTaskDialog(false);
            handleCloseCleanUrl("taskId");
          }}
          task={selectedTask}
          onDelete={handleDeleteTask}
          users={project?.users}
          disabled={loadingUpdateTask || loadingDeleteTask}
        />
      )}

      {selectedTicket &&
        openEditTicketDialog &&
        !openEditTaskDialog &&
        !openTaskDialog && (
          <TicketEditDialog
            key={selectedTicket.id}
            initialTab={searchParams.get("ticketTab") === "tasks" ? 2 : 0}
            onCreateTask={() => {
              setSelectedTicketId(selectedTicket.id);
              const params = new URLSearchParams(searchParams);
              params.set("ticketTab", "tasks");
              setSearchParams(params, { replace: true });
              setOpenTaskDialog(true);
            }}
            onOpenTask={(task) => {
              const params = new URLSearchParams(searchParams);
              params.set("ticketId", String(selectedTicket.id));
              params.set("taskId", String(task.id));
              params.set("ticketTab", "tasks");
              setSearchParams(params);
            }}
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
            tickets={allTickets}
            users={project?.users}
            disabled={loadingUpdateTickets || loadingDeleteTicket}
          />
        )}

      {selectedSprintGoal && openEditSprintGoalDialog && (
        <DialogForm
          open={openEditSprintGoalDialog}
          title="Edit Goal"
          key={selectedSprintGoal.id}
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
          key={selectedGoalTask.id}
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
          itemKey={`ticket:${selectedTicket.id}`}
          disabled={loadingDeleteTicket}
        />
      )}

      {selectedTask && openDeleteTaskDialog && (
        <DeleteConfirmationModal
          open={openDeleteTaskDialog}
          onClose={() => setOpenDeleteTaskDialog(false)}
          onConfirm={() => handleDeleteTask(selectedTask)}
          itemName={selectedTask.title}
          itemKey={`task:${selectedTask.id}`}
          disabled={loadingDeleteTask}
        />
      )}

      {selectedSprint && openDeleteSprintDialog && (
        <DeleteConfirmationModal
          open={openDeleteSprintDialog}
          onClose={() => setOpenDeleteSprintDialog(false)}
          onConfirm={() => handleDeleteSprint(selectedSprint)}
          itemName={selectedSprint.name}
          itemKey={`sprint:${selectedSprint.id}`}
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
          itemKey={`goal:${selectedSprintGoal.id}`}
          disabled={loadingDeleteSprintGoal}
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
          itemKey={`goalTask:${selectedGoalTask.id}`}
          disabled={loadingDeleteGoalTask}
        />
      )}
    </Portal>
  );
};

export default DialogsContainer;
