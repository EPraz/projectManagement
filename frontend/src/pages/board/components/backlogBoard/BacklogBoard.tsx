import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

// Importaciones supuestas, reemplaza con las reales
import { LayoutContextProps, Task, Ticket } from "../../../../types";
import {
  BoardContainer,
  StyledTableCell,
  StyledTableRow,
} from "./BacklogBoard.styles";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { backlogColumns, initialBacklogColumns } from "../../../../constants";
import {
  getColumnWidth,
  renderCellContent,
  renderTaskCellContent,
} from "./BacklogBoard.helpers";

const BacklogBoard = () => {
  const outletContext = useOutletContext<LayoutContextProps>();
  const {
    localTickets,
    setSelectedTicket,
    // setOpenEditTicketDialog,
    // handleDeleteTicket,
    setOpenDeleteTicketDialog,
    setSelectedTask,
    // setOpenEditTaskDialog,
    setOpenDeleteTaskDialog,
    visibleColumns,
    filters,
  } = useMemo(() => outletContext, [outletContext]);
  const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);
  const [_, setSearchParams] = useSearchParams();

  const toggleExpand = (ticketId: number) => {
    setExpandedTicketId((prev) => (prev === ticketId ? null : ticketId));
  };

  const handleOpenEditTicket = (ticket: Ticket) => {
    setSearchParams(
      { tab: "backlog", ticketId: ticket.id.toString() },
      { replace: true }
    );
    // setSelectedTicket(ticket);
    // setOpenEditTicketDialog(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setSearchParams(
      { tab: "backlog", taskId: task.id.toString() },
      { replace: true }
    );
    // setSelectedTask(task);
    // setOpenEditTaskDialog(true);
  };

  const handleOpenDeleteTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setOpenDeleteTicketDialog(true);
  };

  const handleOpenDeleteTask = (task: Task) => {
    setSelectedTask(task);
    setOpenDeleteTaskDialog(true);
  };

  const sortedBacklogColumns = useMemo(() => {
    return [...backlogColumns].sort((a, b) => {
      // Obtener el índice de la columna en initialBacklogColumns para determinar el orden
      const indexA = initialBacklogColumns.indexOf(a.key);
      const indexB = initialBacklogColumns.indexOf(b.key);

      // Si la columna no está en initialBacklogColumns, ponerla al final
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });
  }, [backlogColumns]);

  const filteredTickets = useMemo(() => {
    return localTickets
      .filter((ticket) => {
        if (filters.priority && ticket.priority !== filters.priority)
          return false;
        if (filters.status && ticket.status.name !== filters.status)
          return false;
        if (
          filters.assignedUser &&
          ticket.assignedUser !== filters.assignedUser
        )
          return false;
        if (filters.type && ticket.type !== filters.type) return false;
        if (filters.dueDate && ticket.dueDate !== filters.dueDate) return false;
        if (
          filters.isBlocked !== undefined &&
          ticket.isBlocked !== filters.isBlocked
        )
          return false;
        return true;
      })
      .sort((a, b) => a.order - b.order);
  }, [localTickets]);

  return (
    <BoardContainer>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {/* Columna de expansión siempre visible */}
              {visibleColumns.length > 0 && (
                <StyledTableCell
                  className="header"
                  sx={{ flexGrow: 1, width: "5%" }}
                />
              )}

              {/* Mapeo dinámico de columnas */}
              {sortedBacklogColumns
                .filter((column) => visibleColumns.includes(column.key))
                .map((column) => (
                  <StyledTableCell
                    key={column.key}
                    className="header"
                    sx={{
                      flexGrow: column.key === "title" ? 2 : 1,
                      width: getColumnWidth(column.key),
                    }}
                  >
                    {column.label}
                  </StyledTableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <React.Fragment key={ticket.id}>
                {/* Ticket Row */}
                <StyledTableRow>
                  {/* Columna de expansión */}
                  {visibleColumns.length > 0 && (
                    <StyledTableCell>
                      {ticket.tasks.length > 0 && (
                        <IconButton
                          onClick={() => toggleExpand(ticket.id)}
                          size="small"
                        >
                          {expandedTicketId === ticket.id ? (
                            <ArrowDropDownIcon />
                          ) : (
                            <ArrowRightIcon />
                          )}
                        </IconButton>
                      )}
                    </StyledTableCell>
                  )}

                  {/* Mapeo dinámico de celdas */}
                  {sortedBacklogColumns
                    .filter((column) => visibleColumns.includes(column.key))
                    .map((column) => (
                      <StyledTableCell key={column.key}>
                        {renderCellContent(
                          column.key,
                          ticket,
                          handleOpenEditTicket,
                          handleOpenDeleteTicket
                        )}
                      </StyledTableCell>
                    ))}
                </StyledTableRow>

                {/* Tasks Rows (Expanded) */}
                {expandedTicketId === ticket.id &&
                  ticket.tasks.length > 0 &&
                  ticket.tasks.map((task) => (
                    <StyledTableRow
                      key={task.id}
                      sx={{
                        background: "#f9f9f9",
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      {/* Columna de expansión */}
                      {visibleColumns.length > 0 && <StyledTableCell />}

                      {/* Mapeo dinámico de celdas para tareas */}
                      {sortedBacklogColumns
                        .filter((column) => visibleColumns.includes(column.key))
                        .map((column) => (
                          <StyledTableCell key={column.key}>
                            {renderTaskCellContent(
                              column.key,
                              task,
                              // ticket,
                              handleOpenEditTask,
                              handleOpenDeleteTask
                            )}
                          </StyledTableCell>
                        ))}
                    </StyledTableRow>
                  ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </BoardContainer>
  );
};

export default BacklogBoard;
