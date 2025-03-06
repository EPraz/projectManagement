// DialogsContainer.jsx
import React from "react";
import {
  DeleteConfirmationModal,
  DialogForm,
  EditDialogForm,
  Portal,
} from "..";
import {
  editTaskSchema,
  editTicketSchema,
  createSprintSchema,
  createTaskSchema,
  createTicketSchema,
  createSprintGoalSchema,
  editSprintGoalSchema,
  createGoalTaskSchema,
  editGoalTaskSchema,
} from "../../validations";
import { SprintGoalStatus, TicketPriority, TicketType } from "../../constants";
import { DialogsContainerProps } from "../../types";
import { useSearchParams } from "react-router-dom";
import { formatStatusName } from "../../helpers";

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
  selectedTasksStatuses,
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
  ticketStatuses,
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
          defaultValues={{ title: "", description: "" }}
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
          defaultValues={{ title: "", description: "" }}
        />
      )}
      {openCreateSprintDialog && (
        <DialogForm
          open={openCreateSprintDialog}
          title="Create Sprint"
          onClose={() => setOpenCreateSprintDialog(false)}
          onSubmit={handleCreateSprint}
          schema={createSprintSchema}
          disabled={loadingCreateSprint || loadingDeleteSprint}
          defaultValues={{ name: "", startDate: null, endDate: null }}
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
        <EditDialogForm
          open={openEditTaskDialog}
          onClose={() => {
            setOpenEditTaskDialog(false);
            handleCloseCleanUrl("taskId");
          }}
          onSubmit={handleEditTask}
          onDelete={handleDeleteTask}
          schema={editTaskSchema}
          defaultValues={selectedTask}
          disabled={loadingDeleteTask || loadingUpdateTask}
          idNumber={selectedTask.id.toString()}
          categoryType="Task Type"
          user={{ name: "John Doe", initials: "JD" }}
          sections={[
            { title: "Description", fields: ["description"], expanded: true },
            { title: "Notes", fields: ["notes"] },
          ]}
          selectFields={[
            {
              name: "status",
              label: "Status",
              options: (selectedTasksStatuses || []).map((ts) => ({
                id: ts.id,
                name: ts.name,
                position: ts.position,
              })),
            },
          ]}
          topCenterFields={["status"]}
          rightPanelFields={["createdBy", "createdAt"]}
        />
      )}

      {selectedTicket && openEditTicketDialog && (
        <EditDialogForm
          open={openEditTicketDialog}
          onClose={() => {
            setOpenEditTicketDialog(false);
            handleCloseCleanUrl("ticketId");
          }}
          onSubmit={handleEditTicket}
          onDelete={handleDeleteTicket}
          schema={editTicketSchema}
          defaultValues={selectedTicket}
          disabled={loadingUpdateTickets || loadingDeleteTicket}
          idNumber={selectedTicket.id.toString()}
          categoryType={"Product Backlog Item"}
          user={{ name: "John Doe", initials: "JD" }}
          sections={[
            { title: "Description", fields: ["description"], expanded: true },
            { title: "Aditional Details", fields: ["additionalDetails"] },
            {
              title: "Acceptance Criteria",
              fields: ["acceptanceCriteria"],
              expanded: true,
            },
            { title: "Design Information", fields: ["designInformation"] },
            { title: "Notes", fields: ["notes"] },
            { title: "Tags", fields: ["tags"] },
          ]}
          selectFields={[
            {
              name: "status",
              label: "Status",
              options: (ticketStatuses || []).map((ts) => ({
                id: ts.id,
                name: ts.name,
                position: ts.position,
              })),
            },
            {
              name: "sprint",
              label: "Sprint",
              options: (listOfSprints || []).map((ts) => ({
                id: ts.id,
                name: ts.name,
              })),
            },
            {
              name: "priority",
              label: "Priority",
              options: Object.values(TicketPriority).map((priority) => ({
                id: priority,
                name: priority,
              })),
            },
            {
              name: "type",
              label: "Type",
              options: Object.values(TicketType).map((type) => ({
                id: type,
                name: type,
              })),
            },
            {
              name: "assignedTo",
              label: "Assigned To",
              options: [], //  Opciones a llenar con los usuarios cuando se implemente
            },
          ]}
          topCenterFields={[
            "status",
            "sprint",
            "priority",
            "type",
            "assignedTo",
            "dueDate",
          ]}
          rightPanelFields={[
            "createdBy",
            "createdAt",
            "estimatedHours",
            "remainingHours",
            "completedHours",
            "storyPoints",
          ]}
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
        />
      )}

      {selectedTask && openDeleteTaskDialog && (
        <DeleteConfirmationModal
          open={openDeleteTaskDialog}
          onClose={() => setOpenDeleteTaskDialog(false)}
          onConfirm={() => handleDeleteTask(selectedTask)}
          itemName={selectedTask.title}
        />
      )}

      {selectedSprint && openDeleteSprintDialog && (
        <DeleteConfirmationModal
          open={openDeleteSprintDialog}
          onClose={() => setOpenDeleteSprintDialog(false)}
          onConfirm={() => handleDeleteSprint(selectedSprint)}
          itemName={selectedSprint.name}
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
