import { memo } from "react";
import { Box, TableHead, TableRow, TableBody, IconButton } from "@mui/material";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { TaskColumn } from "../../../components";
import { formatStatusName } from "../../../helpers";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useOutletContext } from "react-router-dom";
import type { LayoutContextProps } from "../../../types";
import {
  StyledTable,
  HeaderCell,
  BodyCell,
  OrderButtons,
  BoardContainer,
  TableWrapper,
} from "./TaskBoard.styles";
import TicketCard from "./TicketCard";

const TaskBoard = () => {
  const {
    project,
    loadingBulkUpdateTickets,
    localTickets,
    setSelectedTicketId,
    selectedTasksStatuses,
    setOpenTaskDialog,
    handleUpdateTicketOrder,
    handleUpdateTicketStatus,
    handleOnDragEndTask,
  } = useOutletContext<LayoutContextProps>();

  return (
    <BoardContainer>
      <TableWrapper>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleOnDragEndTask}
        >
          <StyledTable>
            <TableHead>
              <TableRow>
                <HeaderCell>Tickets</HeaderCell>
                {selectedTasksStatuses?.map((status) => (
                  <HeaderCell key={status.id}>
                    {formatStatusName(status.name)}
                  </HeaderCell>
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
                      <BodyCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <OrderButtons>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleUpdateTicketOrder(ticket.id, "up")
                              }
                              disabled={isFirst || loadingBulkUpdateTickets}
                            >
                              <ArrowUpwardIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleUpdateTicketOrder(ticket.id, "down")
                              }
                              disabled={isLast || loadingBulkUpdateTickets}
                            >
                              <ArrowDownwardIcon fontSize="small" />
                            </IconButton>
                          </OrderButtons>
                          <TicketCard
                            ticket={ticket}
                            onChange={handleUpdateTicketStatus}
                            ticketStatuses={project?.ticketStatuses}
                          />
                        </Box>
                      </BodyCell>
                      {selectedTasksStatuses?.map((status) => (
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
          </StyledTable>
        </DndContext>
      </TableWrapper>
    </BoardContainer>
  );
};

export default memo(TaskBoard);
