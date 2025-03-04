// DialogsContainer.jsx
import React from "react";
import {
  DeleteConfirmationModal,
  DialogForm,
  EditDialogForm,
  Portal,
} from "../../../components";
import {
  editTaskSchema,
  editTicketSchema,
  createSprintSchema,
  createTaskSchema,
  createTicketSchema,
} from "../../../validations";
import { TicketPriority, TicketType } from "../../../constants";
import { DialogsContainerProps } from "../../../types";
import { useSearchParams } from "react-router-dom";

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
    </Portal>
  );
};

export default DialogsContainer;
