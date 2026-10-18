import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useOutletContext } from "react-router-dom";
import type { FilterProps, LayoutContextProps } from "../../../../types";
import { useTicket } from "../../../../context/ticketContext";
import WorkFilters from "../workFilters/WorkFilters";
import { filterTaskboard } from "../workFilters/workFilterPredicates";
import TaskMatrix from "./TaskMatrix";
import TaskGroups from "./TaskGroups";
export default function TaskBoard() {
  const { tickets } = useTicket();
  const {
    project,
    setSelectedTicketId,
    selectedTasksStatuses,
    setSelectedTasksStatuses,
    setOpenTaskDialog,
    handleUpdateTicketStatus,
    handleOnDragEndTask,
    isTaskPending,
    isTicketPending,
  } = useOutletContext<LayoutContextProps>();
  const [filters, setFilters] = useState<FilterProps>({});
  const [taskState, setTaskState] = useState("");
  const [collapsed, setCollapsed] = useState(new Set<number>());
  const [expandedNarrow, setExpandedNarrow] = useState(new Set<number>());
  const [moving, setMoving] = useState(false);
  const wide = useMediaQuery(useTheme().breakpoints.up("lg"));
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );
  const rows = filterTaskboard(
    [...tickets].sort((a, b) => a.order - b.order),
    filters,
    taskState,
  );
  const statuses = [
    ...(selectedTasksStatuses ?? project?.taskStatuses ?? []),
  ].sort((a, b) => a.position - b.position);
  const pending = moving;
  const props = {
    rows,
    collapsed,
    pending,
    isTaskPending,
    isTicketPending,
    ticketStatuses: project?.ticketStatuses,
    changeTicket: handleUpdateTicketStatus,
    toggle: (id: number) =>
      setCollapsed((current) => {
        const next = new Set(current);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      }),
    addTask: (id: number) => {
      setSelectedTicketId(id);
      setOpenTaskDialog(true);
    },
  };
  const move = async (event: DragEndEvent) => {
    if (!event.over || moving) return;
    setMoving(true);
    try {
      await handleOnDragEndTask({
        ...event,
        over: {
          ...event.over,
          id: event.over.data.current?.statusName ?? event.over.id,
        },
      });
    } finally {
      setMoving(false);
    }
  };
  return (
    <Box sx={{ minWidth: 0 }}>
      <WorkFilters
        filters={filters}
        setFilters={setFilters}
        project={project}
        scope="task"
        taskState={taskState}
        onTaskState={setTaskState}
      />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {rows.length} of {tickets.length} sprint tickets ·{" "}
        {rows.reduce((sum, row) => sum + row.tasks.length, 0)} matching tasks
      </Typography>
      {wide && statuses.length < (project?.taskStatuses.length ?? 0) && (
        <Alert
          severity="info"
          sx={{ mb: 2 }}
          action={
            <Button
              onClick={() => setSelectedTasksStatuses(project?.taskStatuses)}
            >
              Show all task columns
            </Button>
          }
        >
          Some task-state columns are hidden. Task counts include matching work
          in hidden columns.
        </Alert>
      )}
      {!rows.length ? (
        <Alert severity="info">
          {tickets.length
            ? "No work matches these filters. Clear filters to see this sprint’s tickets."
            : "No tickets in this sprint yet. Add a ticket to start planning work."}
        </Alert>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragEnd={move}
        >
          {wide ? (
            <TaskMatrix {...props} statuses={statuses} />
          ) : (
            <TaskGroups
              {...props}
              collapsed={
                new Set(
                  rows
                    .filter((row) => !expandedNarrow.has(row.ticket.id))
                    .map((row) => row.ticket.id),
                )
              }
              toggle={(id) =>
                setExpandedNarrow((current) => {
                  const next = new Set(current);
                  if (next.has(id)) next.delete(id);
                  else next.add(id);
                  return next;
                })
              }
            />
          )}
        </DndContext>
      )}
    </Box>
  );
}
