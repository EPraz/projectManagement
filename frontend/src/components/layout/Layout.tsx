import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import type { TaskUpdate, TicketUpdate } from "../../services/workItemUpdates";
import { useAuth, useProject, useSprint, useTicket } from "../../context";
import { useSprintPlanning } from "./useSprintPlanning";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import {
  useBulkUpdateTickets,
  useCreateTask,
  useCreateTicket,
  useDeleteTask,
  useDeleteTicket,
  useUpdateTask,
  useUpdateTicket
} from "../../hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FilterProps,
  GoalTask,
  Sprint,
  SprintGoal,
  Task,
  TaskStatus,
  Ticket
} from "../../types";
import {
  changeSprintHandler,
  createTaskHandler,
  // createTicketHandler,
  // deleteTicketHandler,
  // editTicketHandler,
  onDragEndTaskHandler,
  updateTicketOrderHandler,
  updateTicketStatusHandler
} from "../../helpers";
import { initialBacklogColumns } from "../../constants";
import { TabPanels } from "../../constants/tabPanels";
import {
  LayoutRoot,
  LayoutWrapper,
  MainContent,
  PageContent
} from "./Layout.styles";
import DialogsContainer from "../dialogsContainer/DialogsContainer";
import { Alert, Button } from "@mui/material";

const Layout = () => {
  // Providers
  const {
    project,
    loading: loadingProject,
    refreshing,
    error: projectError,
    reloadProject
  } = useProject();
  const { user: currentUser } = useAuth();
  const pendingTaskMoves = useRef(new Set<Task["id"]>());

  const { sprint, listOfSprints, setSprint } = useSprint();
  const {
    tickets,
    allTickets,
    removeAllTickets,
    addAllTickets,
    updateAllTickets,
    updateListOfTickets,
    applyTaskUpdate,
    removeTask
  } = useTicket();

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const { createTicket, loading: loadingPostTickets } = useCreateTicket();
  const {
    updateTicket,
    loading: loadingUpdateTickets,
    isPending: isUpdatingTicket
  } = useUpdateTicket();
  const { bulkUpdateTickets, loading: loadingBulkUpdateTickets } =
    useBulkUpdateTickets();
  const {
    deleteTicket,
    loading: loadingDeleteTicket,
    isPending: isDeletingTicket
  } = useDeleteTicket();

  const { createTask, loading: loadingPostTasks } = useCreateTask();
  const {
    updateTask,
    loading: loadingUpdateTask,
    isPending: isUpdatingTask
  } = useUpdateTask();
  const {
    deleteTask,
    loading: loadingDeleteTask,
    isPending: isDeletingTask
  } = useDeleteTask();

  // Local States -> Sidebar
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    const savedOptionSelected = localStorage.getItem("sidebarOpen");
    return savedOptionSelected === "false" || savedOptionSelected === "true"
      ? String(savedOptionSelected).toLowerCase() === "true"
      : true;
  });

  // Local States -> Tickets
  const [openCreateTicketDialog, setOpenCreateTicketDialog] =
    useState<boolean>(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number>(0);
  const [openEditTicketDialog, setOpenEditTicketDialog] =
    useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [openDeleteTicketDialog, setOpenDeleteTicketDialog] =
    useState<boolean>(false);

  // Local States -> Tasks
  const [selectedTasksStatuses, setSelectedTasksStatuses] = useState<
    TaskStatus[] | undefined
  >(project?.taskStatuses);
  const [openTaskDialog, setOpenTaskDialog] = useState<boolean>(false);
  const [openEditTaskDialog, setOpenEditTaskDialog] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [openDeleteTaskDialog, setOpenDeleteTaskDialog] =
    useState<boolean>(false);

  // Local States -> Filters backlog
  const [filters, setFilters] = useState<FilterProps>({});

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    initialBacklogColumns
  );

  const handleApplyFilter = (newFilters: FilterProps) => {
    setFilters(newFilters);
  };

  // Local States -> Board
  const requestedTab = searchParams.get("tab") || "board";
  const tabValue = Math.max(
    0,
    TabPanels.findIndex((tab) => tab.label.toLowerCase() === requestedTab)
  );

  const handleChangeTabValue = (newValue: number) => {
    setSearchParams(
      { tab: TabPanels[newValue].label.toLowerCase() },
      { replace: true }
    );
  };

  useEffect(() => {
    const currentTab = searchParams.get("tab");
    const newTab = TabPanels[tabValue].label.toLowerCase();
    const isBoardRoute = location.pathname.endsWith("/board");

    if (isBoardRoute) {
      if (currentTab !== newTab) {
        const params = new URLSearchParams(searchParams);
        params.set("tab", newTab);
        setSearchParams(params, { replace: true });
      }
    } else if (searchParams.toString()) {
      setSearchParams({}, { replace: true });
    }

    const ticketId = searchParams.get("ticketId");
    const taskId = searchParams.get("taskId");

    if (ticketId) {
      const foundTicket = allTickets.find((t) => t.id.toString() === ticketId);
      if (foundTicket) {
        setSelectedTicket(foundTicket);
        setOpenEditTicketDialog(true);
      }
    } else {
      setSelectedTicket(null);
    }

    if (taskId) {
      const foundTask = allTickets
        .flatMap((t) => t.tasks)
        .find((task) => task.id.toString() === taskId);
      if (foundTask) {
        setSelectedTask(foundTask);
        setOpenEditTaskDialog(true);
      }
    } else {
      setSelectedTask(null);
    }
  }, [tabValue, searchParams, setSearchParams, location.pathname, allTickets]);

  // Local States -> Sprint
  const [openCreateSprintDialog, setOpenCreateSprintDialog] =
    useState<boolean>(false);
  const [openDeleteSprintDialog, setOpenDeleteSprintDialog] =
    useState<boolean>(false);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);

  // Local States ->  Goal Board
  const [selectedSprintGoal, setSelectedSprintGoal] =
    useState<SprintGoal | null>(null);
  const [selectedGoalTask, setSelectedGoalTask] = useState<GoalTask | null>(
    null
  );
  const [openCreateSprintGoalDialog, setOpenCreateSprintGoalDialog] =
    useState(false);
  const [openEditSprintGoalDialog, setOpenEditSprintGoalDialog] =
    useState(false);
  const [openDeleteSprintGoalDialog, setOpenDeleteSprintGoalDialog] =
    useState(false);

  const [openCreateTaskToSprintGoalDialog, setOpenCreateGoalTaskDialog] =
    useState(false);
  const [openEditGoalTaskDialog, setOpenEditGoalTaskDialog] = useState(false);
  const [openDeleteGoalTaskDialog, setOpenDeleteGoalTaskDialog] =
    useState(false);

  useEffect(() => {
    setOpenCreateSprintDialog(false);
    setOpenDeleteSprintDialog(false);
    setOpenCreateSprintGoalDialog(false);
    setOpenEditSprintGoalDialog(false);
    setOpenDeleteSprintGoalDialog(false);
    setOpenCreateGoalTaskDialog(false);
    setOpenEditGoalTaskDialog(false);
    setOpenDeleteGoalTaskDialog(false);
    setSelectedSprintGoal(null);
    setSelectedGoalTask(null);
  }, [sprint?.id, location.pathname]);

  // Functions

  // Functions -> Tickets
  const handleCreateTicket = useCallback(
    async (data: Partial<Ticket>) => {
      const newTicket = await createTicket({
        ...data
      });
      if (newTicket) {
        addAllTickets(newTicket);
      }
    },
    [createTicket, addAllTickets]
  );

  const handleEditTicket = useCallback(
    async (data: TicketUpdate) => {
      const updatedTicket = await updateTicket({
        ...data
      });
      if (updatedTicket) {
        updateAllTickets(updatedTicket);
      }
      return Boolean(updatedTicket);
    },
    [updateTicket, updateAllTickets]
  );

  const handleDeleteTicket = useCallback(
    async (data: Partial<Ticket>) => {
      const success = await deleteTicket(data);
      if (success) {
        removeAllTickets(data?.id || 0);
      }
      return Boolean(success);
    },
    [deleteTicket, removeAllTickets]
  );

  const handleUpdateTicketOrder = useCallback(
    updateTicketOrderHandler(
      bulkUpdateTickets,
      tickets,
      currentUser?.email,
      updateListOfTickets
    ),
    [bulkUpdateTickets, tickets, currentUser?.email, updateListOfTickets]
  );

  const handleUpdateTicketStatus = useCallback(
    updateTicketStatusHandler(
      updateTicket,
      tickets,
      currentUser?.email,
      updateAllTickets
    ),
    [updateTicket, tickets, currentUser?.email, updateAllTickets]
  );

  // Functions -> Tasks
  const handleCreateTask = useCallback(
    createTaskHandler(
      createTask,
      selectedTicketId,
      tickets,
      updateListOfTickets
    ),
    [createTask, selectedTicketId, tickets, updateListOfTickets]
  );

  const handleEditTask = useCallback(
    async (data: TaskUpdate) => {
      const updatedTask = await updateTask(data);
      if (updatedTask) applyTaskUpdate(updatedTask);
      return Boolean(updatedTask);
    },
    [updateTask, applyTaskUpdate]
  );

  const handleDeleteTask = useCallback(
    async (data: Partial<Task>) => {
      const success = await deleteTask(data);
      if (success && data.id) {
        removeTask(data.id);
      }
      return Boolean(success);
    },
    [deleteTask, removeTask]
  );

  const handleOnDragEndTask = useCallback(
    onDragEndTaskHandler(
      updateTask,
      tickets,
      project?.taskStatuses,
      applyTaskUpdate,
      currentUser?.email,
      pendingTaskMoves.current
    ),
    [
      updateTask,
      tickets,
      project?.taskStatuses,
      applyTaskUpdate,
      currentUser?.email
    ]
  );

  const {
    handleCreateSprint,
    handleDeleteSprint,
    handleCreateSprintGoal,
    handleEditSprintGoal,
    handleDeleteSprintGoal,
    handleCreateGoalTask,
    handleEditGoalTask,
    handleDeleteGoalTask,
    handleToggleGoalTaskCompletion,
    isGoalTaskPending,
    planningError,
    loadingCreateSprint,
    isDeletingSprint,
    loadingCreateSprintGoal,
    loadingUpdateSprintGoal,
    loadingDeleteSprintGoal,
    loadingCreateGoalTask,
    loadingUpdateGoalTask,
    loadingDeleteGoalTask
  } = useSprintPlanning(sprint, selectedSprintGoal, selectedGoalTask);
  const loadingDeleteSprint = isDeletingSprint(selectedSprint?.id);
  const handleChangeSprint = useCallback(
    changeSprintHandler(listOfSprints, sprint, setSprint),
    [listOfSprints, sprint, setSprint]
  );

  return (
    <LayoutWrapper>
      <LayoutRoot>
        <Sidebar
          project={project!}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <MainContent sidebarOpen={sidebarOpen}>
          <Header
            projectName={project?.title ?? ""}
            projectId={project?.id ?? ""}
            refreshing={refreshing}
            onRefresh={() => {
              void reloadProject();
            }}
          />
          <PageContent>
            {planningError && <Alert severity="error">{planningError}</Alert>}
            {projectError && (
              <Alert
                severity="error"
                action={
                  <Button
                    color="inherit"
                    disabled={refreshing}
                    onClick={() => {
                      void reloadProject();
                    }}
                  >
                    Retry project
                  </Button>
                }
              >
                {projectError.message}
              </Alert>
            )}
            <Outlet
              context={{
                // Project
                project,
                loadingProject,
                // Sprint
                tickets,
                sprint,
                listOfSprints,
                // Tasks
                createTask,
                loadingPostTasks,
                updateTask,
                loadingUpdateTask,
                deleteTask,
                loadingDeleteTask,
                // Tickets
                allTickets,
                createTicket,
                loadingPostTickets,
                updateTicket,
                loadingUpdateTickets,
                bulkUpdateTickets,
                loadingBulkUpdateTickets,
                deleteTicket,
                loadingDeleteTicket,
                // Local Variables
                // Local States -> Tickets
                openCreateTicketDialog,
                setOpenCreateTicketDialog,
                selectedTicketId,
                setSelectedTicketId,
                openEditTicketDialog,
                setOpenEditTicketDialog,
                selectedTicket,
                setSelectedTicket,
                // Local States -> Tasks
                selectedTasksStatuses,
                setSelectedTasksStatuses,
                openTaskDialog,
                setOpenTaskDialog,
                openEditTaskDialog,
                setOpenEditTaskDialog,
                selectedTask,
                setSelectedTask,
                openDeleteTicketDialog,
                setOpenDeleteTicketDialog,
                setOpenDeleteTaskDialog,
                openDeleteTaskDialog,
                //Local States -> Filters Backlog
                filters,
                setFilters,
                visibleColumns,
                setVisibleColumns,
                handleApplyFilter,
                //Local States -> Board
                tabValue,
                handleChangeTabValue,
                //Local States -> Sprint
                openCreateSprintDialog,
                setOpenCreateSprintDialog,
                handleCreateSprint,
                handleChangeSprint,
                handleDeleteSprint,
                openDeleteSprintDialog,
                setOpenDeleteSprintDialog,
                selectedSprint,
                setSelectedSprint,
                loadingCreateSprint,
                loadingDeleteSprint,
                // Local States ->  Goal Board
                isGoalTaskPending,
                selectedSprintGoal,
                setSelectedSprintGoal,
                selectedGoalTask,
                setSelectedGoalTask,
                openCreateSprintGoalDialog,
                setOpenCreateSprintGoalDialog,
                openEditSprintGoalDialog,
                setOpenEditSprintGoalDialog,
                openDeleteSprintGoalDialog,
                setOpenDeleteSprintGoalDialog,
                openCreateTaskToSprintGoalDialog,
                setOpenCreateGoalTaskDialog,
                openDeleteGoalTaskDialog,
                setOpenDeleteGoalTaskDialog,
                openEditGoalTaskDialog,
                setOpenEditGoalTaskDialog,

                // Functions
                // Functions -> Tickets
                handleCreateTicket,
                handleEditTicket,
                handleDeleteTicket,
                handleUpdateTicketOrder,
                handleUpdateTicketStatus,
                // Functions -> Tasks
                handleCreateTask,
                handleEditTask,
                handleDeleteTask,
                handleOnDragEndTask,
                // Functions -> Sprint Goal
                handleCreateSprintGoal,
                handleToggleGoalTaskCompletion
              }}
            />
          </PageContent>
        </MainContent>

        {/* // All Dialog / Modals */}
        <DialogsContainer
          //Tasks
          handleCreateTask={handleCreateTask}
          handleDeleteTask={handleDeleteTask}
          handleEditTask={handleEditTask}
          loadingDeleteTask={isDeletingTask(selectedTask?.id)}
          loadingPostTasks={loadingPostTasks}
          loadingUpdateTask={isUpdatingTask(selectedTask?.id)}
          openTaskDialog={openTaskDialog}
          selectedTasksStatuses={selectedTasksStatuses}
          selectedTask={selectedTask}
          setOpenEditTaskDialog={setOpenEditTaskDialog}
          setOpenTaskDialog={setOpenTaskDialog}
          openEditTaskDialog={openEditTaskDialog}
          setOpenDeleteTaskDialog={setOpenDeleteTaskDialog}
          openDeleteTaskDialog={openDeleteTaskDialog}
          //Tickets
          handleCreateTicket={handleCreateTicket}
          handleDeleteTicket={handleDeleteTicket}
          handleEditTicket={handleEditTicket}
          loadingDeleteTicket={isDeletingTicket(selectedTicket?.id)}
          loadingPostTickets={loadingPostTickets}
          loadingUpdateTickets={isUpdatingTicket(selectedTicket?.id)}
          openEditTicketDialog={openEditTicketDialog}
          openCreateTicketDialog={openCreateTicketDialog}
          selectedTicket={selectedTicket}
          setOpenEditTicketDialog={setOpenEditTicketDialog}
          setOpenCreateTicketDialog={setOpenCreateTicketDialog}
          ticketStatuses={project?.ticketStatuses}
          openDeleteTicketDialog={openDeleteTicketDialog}
          setOpenDeleteTicketDialog={setOpenDeleteTicketDialog}
          //Sprint
          listOfSprints={listOfSprints}
          openCreateSprintDialog={openCreateSprintDialog}
          setOpenCreateSprintDialog={setOpenCreateSprintDialog}
          openDeleteSprintDialog={openDeleteSprintDialog}
          setOpenDeleteSprintDialog={setOpenDeleteSprintDialog}
          handleCreateSprint={handleCreateSprint}
          handleDeleteSprint={handleDeleteSprint}
          selectedSprint={selectedSprint}
          loadingDeleteSprint={loadingDeleteSprint}
          loadingCreateSprint={loadingCreateSprint}
          // Sprint Goal
          loadingCreateSprintGoal={loadingCreateSprintGoal}
          openCreateSprintGoalDialog={openCreateSprintGoalDialog}
          setOpenCreateSprintGoalDialog={setOpenCreateSprintGoalDialog}
          handleCreateSprintGoal={handleCreateSprintGoal}
          selectedSprintGoal={selectedSprintGoal}
          openDeleteSprintGoalDialog={openDeleteSprintGoalDialog}
          setOpenDeleteSprintGoalDialog={setOpenDeleteSprintGoalDialog}
          setSelectedSprintGoal={setSelectedSprintGoal}
          handleDeleteSprintGoal={handleDeleteSprintGoal}
          handleEditSprintGoal={handleEditSprintGoal}
          loadingDeleteSprintGoal={loadingDeleteSprintGoal}
          loadingUpdateSprintGoal={loadingUpdateSprintGoal}
          openEditSprintGoalDialog={openEditSprintGoalDialog}
          setOpenEditSprintGoalDialog={setOpenEditSprintGoalDialog}
          setOpenCreateGoalTaskDialog={setOpenCreateGoalTaskDialog}
          openCreateTaskToSprintGoalDialog={openCreateTaskToSprintGoalDialog}
          handleCreateGoalTask={handleCreateGoalTask}
          loadingCreateGoalTask={loadingCreateGoalTask}
          handleEditGoalTask={handleEditGoalTask}
          loadingUpdateGoalTask={loadingUpdateGoalTask}
          openDeleteGoalTaskDialog={openDeleteGoalTaskDialog}
          setOpenDeleteGoalTaskDialog={setOpenDeleteGoalTaskDialog}
          openEditGoalTaskDialog={openEditGoalTaskDialog}
          setOpenEditGoalTaskDialog={setOpenEditGoalTaskDialog}
          loadingDeleteGoalTask={loadingDeleteGoalTask}
          handleDeleteGoalTask={handleDeleteGoalTask}
          selectedGoalTask={selectedGoalTask}
          setSelectedGoalTask={setSelectedGoalTask}
        />
      </LayoutRoot>
    </LayoutWrapper>
  );
};

export default Layout;
