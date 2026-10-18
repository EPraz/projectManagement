import { Fragment, useState } from "react";
import {
  Alert,
  Button,
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import { useOutletContext, useSearchParams } from "react-router-dom";
import type { LayoutContextProps, Task, Ticket } from "../../../../types";
import { backlogColumns } from "../../../../constants";
import { useTicket } from "../../../../context/ticketContext";
import {
  matchesSearch,
  matchesTicket,
} from "../workFilters/workFilterPredicates";
import { renderCellContent } from "./BacklogBoard.helpers";
import BacklogTasks from "./BacklogTasks";
export default function BacklogBoard() {
  const { tickets } = useTicket();
  const {
    sprint,
    visibleColumns,
    filters,
    setSelectedTicket,
    setOpenDeleteTicketDialog,
    setSelectedTask,
    setOpenDeleteTaskDialog,
    setSelectedTicketId,
    setOpenTaskDialog,
  } = useOutletContext<LayoutContextProps>();
  const [expanded, setExpanded] = useState(new Set<number>());
  const [params, setParams] = useSearchParams();
  const wide = useMediaQuery(useTheme().breakpoints.up("lg"));
  const columns = [...backlogColumns]
    .sort((a, b) => a.order - b.order)
    .filter((column) => visibleColumns.includes(column.key));
  const filtered = tickets
    .filter(
      (ticket) =>
        matchesTicket(ticket, filters) &&
        matchesSearch(ticket.title, ticket.id, filters.search),
    )
    .sort((a, b) => a.order - b.order);
  const openTicket = (ticket: Ticket) => {
    const next = new URLSearchParams(params);
    next.set("ticketId", String(ticket.id));
    next.delete("taskId");
    next.delete("ticketTab");
    setParams(next, { replace: true });
  };
  const openTask = (task: Task) => {
    const next = new URLSearchParams(params);
    next.set("taskId", String(task.id));
    next.delete("ticketId");
    next.delete("ticketTab");
    setParams(next, { replace: true });
  };
  const removeTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setOpenDeleteTicketDialog(true);
  };
  const removeTask = (task: Task) => {
    setSelectedTask(task);
    setOpenDeleteTaskDialog(true);
  };
  const toggle = (id: number) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const expand = (ticket: Ticket) => (
    <IconButton
      aria-label={`${expanded.has(ticket.id) ? "Collapse" : "Expand"} tasks for ${ticket.title}`}
      aria-expanded={expanded.has(ticket.id)}
      onClick={() => toggle(ticket.id)}
    >
      {expanded.has(ticket.id) ? <ExpandMore /> : <ChevronRight />}
    </IconButton>
  );
  const tasks = (ticket: Ticket) => (
    <BacklogTasks
      ticket={ticket}
      open={openTask}
      remove={removeTask}
      add={() => {
        setSelectedTicketId(ticket.id);
        setOpenTaskDialog(true);
      }}
    />
  );
  const value = (key: string, ticket: Ticket) =>
    renderCellContent(key, ticket, openTicket, removeTicket, sprint?.name);
  if (!columns.length)
    return (
      <Alert severity="info">
        Select a column from Column Options to view the backlog.
      </Alert>
    );
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {filtered.length} of {tickets.length} tickets · Selected sprint only
      </Typography>
      {!filtered.length ? (
        <Alert severity="info">
          {tickets.length
            ? "No tickets match this sprint and its filters."
            : "No tickets in this sprint yet. Add a ticket to start planning work."}
        </Alert>
      ) : wide ? (
        <Paper
          variant="outlined"
          sx={{ borderRadius: "12px", overflow: "hidden" }}
        >
          <TableContainer
            role="region"
            aria-label="Backlog table"
            tabIndex={0}
            sx={{ maxHeight: "74dvh" }}
          >
            <Table
              stickyHeader
              aria-label="Selected sprint backlog"
              sx={{
                minWidth: columns.reduce(
                  (sum, column) =>
                    sum +
                    (column.key === "title"
                      ? 320
                      : column.key === "state"
                        ? 180
                        : 130),
                  60,
                ),
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell aria-label="Child tasks" sx={{ width: 60 }} />
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      sx={{
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        minWidth: column.key === "title" ? 300 : 120,
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((ticket) => (
                  <Fragment key={ticket.id}>
                    <TableRow sx={{ "& > td": { verticalAlign: "middle" } }}>
                      <TableCell>{expand(ticket)}</TableCell>
                      {columns.map((column) => (
                        <TableCell
                          key={column.key}
                          sx={{ overflowWrap: "anywhere" }}
                        >
                          {value(column.key, ticket)}
                        </TableCell>
                      ))}
                    </TableRow>
                    {expanded.has(ticket.id) && (
                      <TableRow>
                        <TableCell colSpan={columns.length + 1}>
                          {tasks(ticket)}
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Box
          role="region"
          aria-label="Selected sprint work list"
          sx={{ display: "grid", gap: 2 }}
        >
          {filtered.map((ticket) => (
            <Paper
              component="article"
              aria-label={`Ticket #${ticket.id}`}
              variant="outlined"
              key={ticket.id}
              sx={{ p: { xs: 2, sm: 3 }, borderRadius: "12px", minWidth: 0 }}
            >
              <Typography variant="overline" color="primary">
                {visibleColumns.includes("id")
                  ? `TICKET / #${ticket.id}`
                  : "TICKET"}
              </Typography>
              <Box sx={{ mb: 2 }}>
                {visibleColumns.includes("title") ? (
                  value("title", ticket)
                ) : (
                  <Button onClick={() => openTicket(ticket)}>
                    Open ticket
                  </Button>
                )}
              </Box>
              <Box
                component="dl"
                sx={{
                  m: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(2,minmax(0,1fr))",
                  gap: 2,
                }}
              >
                {columns
                  .filter(
                    (column) =>
                      !["title", "actions", "id"].includes(column.key),
                  )
                  .map((column) => (
                    <Box key={column.key} sx={{ minWidth: 0 }}>
                      <Typography
                        component="dt"
                        variant="body2"
                        color="text.secondary"
                      >
                        {column.label}
                      </Typography>
                      <Box
                        component="dd"
                        sx={{
                          m: 0,
                          mt: 0.5,
                          fontSize: 16,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {value(column.key, ticket)}
                      </Box>
                    </Box>
                  ))}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: "1px solid",
                  borderColor: "divider",
                  mt: 2,
                  pt: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {expand(ticket)}
                  <Typography variant="body2">
                    {ticket.tasks.length} tasks
                  </Typography>
                </Box>
                {visibleColumns.includes("actions") && value("actions", ticket)}
              </Box>
              {expanded.has(ticket.id) && tasks(ticket)}
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}
