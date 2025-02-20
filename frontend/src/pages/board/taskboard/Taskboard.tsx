import { useState, useEffect, memo, useCallback } from "react";
import {
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
} from "@mui/material";
import { closestCenter, DndContext } from "@dnd-kit/core";
import StatusConfig from "../../sprintBoardPage/StatusConfig";
import { useProject, useSprint } from "../../../context";
import TicketRow from "../../sprintBoardPage/TicketRow";
import { DialogForm, Portal, TaskColumn } from "../../../components";
import AddIcon from "@mui/icons-material/Add";
import { Ticket } from "../../../types";
import { ticketSchema, taskSchema } from "../../../validations";
import {
  useBulkUpdateTickets,
  useCreateTask,
  useCreateTicket,
  useUpdateTask,
  useUpdateTicket,
} from "../../../hooks";
import { formatStatusName } from "../../../helpers";
import {
  changeTicketStatusHandler,
  createTaskHandler,
  createTicketHandler,
  onDragEndHandler,
  updateTicketOrderHandler,
} from "./taskboard.helpers";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const TaskBoard = () => {
  const { tickets, sprint, listOfSprints } = useSprint();
  const { project } = useProject();
  const { createTask, loading: loadingPostTasks } = useCreateTask();
  const { createTicket, loading: loadingPostTickets } = useCreateTicket();
  const { updateTicket } = useUpdateTicket();
  const { updateTask } = useUpdateTask();
  const { bulkUpdateTickets } = useBulkUpdateTickets();
  const [selectedStatuses, setSelectedStatuses] = useState(
    project?.taskStatuses
  );
  const [localTickets, setLocalTickets] = useState<Ticket[]>(tickets);
  const [openTicketDialog, setOpenTicketDialog] = useState<boolean>(false);

  const [openTaskDialog, setOpenTaskDialog] = useState<boolean>(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number>(0);

  useEffect(() => {
    setLocalTickets(tickets);
  }, [tickets]);

  const handleCreateTask = useCallback(
    createTaskHandler(
      createTask,
      setOpenTaskDialog,
      setLocalTickets,
      selectedTicketId
    ),
    [createTask, setOpenTaskDialog, setLocalTickets, selectedTicketId]
  );

  const handleCreateTicket = useCallback(
    createTicketHandler(
      createTicket,
      setOpenTicketDialog,
      setLocalTickets,
      sprint?.id
    ),
    [createTicket, setOpenTicketDialog, setLocalTickets, sprint?.id]
  );

  const handleChangeTicketStatus = useCallback(
    changeTicketStatusHandler(
      updateTicket,
      setLocalTickets,
      localTickets,
      tickets
    ),
    [updateTicket, setLocalTickets, localTickets, tickets]
  );

  const handleOnDragEnd = useCallback(
    onDragEndHandler(
      updateTask,
      setLocalTickets,
      localTickets,
      tickets,
      project?.taskStatuses
    ),
    [updateTask, setLocalTickets, localTickets, tickets, project?.taskStatuses]
  );

  const handleUpdateTicketOrder = useCallback(
    updateTicketOrderHandler(setLocalTickets, localTickets, bulkUpdateTickets),
    [setLocalTickets, localTickets, updateTicket]
  );

  const isDisabled = !listOfSprints?.length;

  return (
    <Container sx={{ border: "1px solid black" }}>
      <StatusConfig
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        items={project?.taskStatuses}
      />
      <Tooltip
        title={isDisabled ? "You must create a Sprint first" : ""}
        arrow
        sx={{ width: "fit-content" }}
        placement="bottom"
      >
        <span>
          <IconButton
            onClick={() => !isDisabled && setOpenTicketDialog(true)}
            disabled={isDisabled}
            sx={{
              height: "35px",
              width: "fit-content",
              border: "1px solid green",
              borderRadius: "8px",
              fontSize: "12px",
              display: "flex",
              gap: "8px",
              color: isDisabled ? "gray" : "inherit",
              borderColor: isDisabled ? "gray" : "green",
            }}
          >
            Add New Item
            <AddIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Portal>
        {openTicketDialog && (
          <DialogForm
            open={openTicketDialog}
            title="Create Ticket"
            onClose={() => setOpenTicketDialog(false)}
            onSubmit={handleCreateTicket}
            schema={ticketSchema}
            disabled={loadingPostTickets}
            defaultValues={{
              title: "",
              description: "",
            }}
          />
        )}

        {openTaskDialog && (
          <DialogForm
            open={openTaskDialog}
            title="Create Task"
            onClose={() => setOpenTaskDialog(false)}
            onSubmit={handleCreateTask}
            schema={taskSchema}
            disabled={loadingPostTasks}
            defaultValues={{
              title: "",
              description: "",
            }}
          />
        )}
      </Portal>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleOnDragEnd}
      >
        <Table stickyHeader aria-label="TaskBoard" width="100%">
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderRight: "1px solid rgba(0, 0, 0, 0.2)" }}>
                Tickets
              </TableCell>
              {selectedStatuses?.map((status) => (
                <TableCell
                  key={status.id}
                  sx={{
                    borderRight: "1px solid rgba(0, 0, 0, 0.2)",
                    fontSize: " 12px",
                  }}
                >
                  {formatStatusName(status.name)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {localTickets
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((ticket, index) => {
                const isFirst = index === 0;
                const isLast = index === localTickets.length - 1;

                return (
                  <TableRow key={ticket.id}>
                    <TableCell
                      sx={{ borderRight: "1px solid rgba(0, 0, 0, 0.2)" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleUpdateTicketOrder(ticket.id, "up")
                          }
                          disabled={isFirst}
                        >
                          <ArrowUpwardIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleUpdateTicketOrder(ticket.id, "down")
                          }
                          disabled={isLast}
                        >
                          <ArrowDownwardIcon />
                        </IconButton>
                        <TicketRow
                          ticket={ticket}
                          onChange={handleChangeTicketStatus}
                          ticketStatuses={project?.ticketStatuses}
                        />
                      </div>
                    </TableCell>
                    {selectedStatuses?.map((status) => (
                      <TaskColumn
                        key={status.id}
                        id={status.name}
                        ticketId={ticket.id}
                        tasks={ticket.tasks.filter(
                          (task) => task.statusId === status.id
                        )}
                        addTask={
                          status.name === "TODO"
                            ? () => {
                                setOpenTaskDialog(true);
                                setSelectedTicketId(ticket.id);
                              }
                            : undefined
                        }
                      />
                    ))}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </DndContext>
    </Container>
  );
};

export default memo(TaskBoard);
