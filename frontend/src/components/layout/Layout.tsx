import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import type { TaskUpdate, TicketUpdate } from "../../services/workItemUpdates";
import { useAuth, useProject, useSprint, useTicket } from "../../context";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import {
  useBulkUpdateTickets,
  useCreateSprint,
  useCreateSprintGoal,
  useCreateTask,
  useCreateGoalTask,
  useCreateTicket,
  useDeleteSprint,
  useDeleteSprintGoal,
  useDeleteTask,
  useDeleteGoalTask,
  useDeleteTicket,
  useUpdateSprintGoal,
  useUpdateTask,
  useUpdateGoalTask,
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
  createSprintGoalHandler,
  createSprintHandler,
  createTaskHandler,
  createTaskToSprintGoalHandler,
  // createTicketHandler,
  deleteSprintGoalHandler,
  deleteSprintHandler,
  deleteGoalTaskHandler,
  // deleteTicketHandler,
  editSprintGoalHandler,
  editGoalTaskHandler,
  // editTicketHandler,
  onDragEndTaskHandler,
  updateTicketOrderHandler,
  updateTicketStatusHandler,
  toggleTaskCompletionHandler
} from "../../helpers";
import { initialBacklogColumns, TabPanels } from "../../constants";
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

  const {
    sprint,
    listOfSprints,
    setSprint,
    addOnListOfSprints,
    removeSprintFromState
    // removeSprintFromState,
  } = useSprint();
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
  const { updateTicket, loading: loadingUpdateTickets } = useUpdateTicket();
  const { bulkUpdateTickets, loading: loadingBulkUpdateTickets } =
    useBulkUpdateTickets();
  const { deleteTicket, loading: loadingDeleteTicket } = useDeleteTicket();

  const { createTask, loading: loadingPostTasks } = useCreateTask();
  const { updateTask, loading: loadingUpdateTask } = useUpdateTask();
  const { deleteTask, loading: loadingDeleteTask } = useDeleteTask();

  const { createSprint, loading: loadingCreateSprint } = useCreateSprint();
  const { deleteSprint, loading: loadingDeleteSprint } = useDeleteSprint();

  const { createSprintGoal, loading: loadingCreateSprintGoal } =
    useCreateSprintGoal();
  const { deleteSprintGoal, loading: loadingDeleteSprintGoal } =
    useDeleteSprintGoal();
  const { updateSprintGoal, loading: loadingUpdateSprintGoal } =
    useUpdateSprintGoal();

  const { createGoalTask, loading: loadingCreateGoalTask } =
    useCreateGoalTask();
  const { updateGoalTask, loading: loadingUpdateGoalTask } =
    useUpdateGoalTask();
  const { deleteGoalTask, loading: loadingDeleteGoalTask } =
    useDeleteGoalTask();

  // Local States -> Sidebar
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    const savedOptionSelected = localStorage.getItem("sidebarOpen");
    return savedOptionSelected === "false" || savedOptionSelected === "true"
      ? String(savedOptionSelected).toLowerCase() === "true"
      : true;
  });

  // Local States -> Tickets
  const [localTickets, setLocalTickets] = useState<Ticket[]>(tickets);
  const [openCreateTicketDialog, setOpenCreateTicketDialog] =
    useState<boolean>(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number>(0);
  const [openEditTicketDialog, setOpenEditTicketDialog] =
    useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [openDeleteTicketDialog, setOpenDeleteTicketDialog] =
    useState<boolean>(false);

  useEffect(() => {
    setLocalTickets(tickets);
  }, [tickets]);

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
  const initialTab = searchParams.get("tab") || "board";
  const initialIndex =
    TabPanels.findIndex((tab) => tab.label.toLowerCase() === initialTab) || 0;
  const [tabValue, setTabValue] = useState<number>(initialIndex);

  const handleChangeTabValue = (newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const currentTab = searchParams.get("tab");
    const newTab = TabPanels[tabValue].label.toLowerCase();
    const isBoardRoute = location.pathname.endsWith("/board");

    if (isBoardRoute) {
      if (currentTab !== newTab) {
        setSearchParams({ tab: newTab }, { replace: true });
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
  const [localSprintGoals, setLocalSprintGoals] = useState<SprintGoal[]>(
    sprint?.sprintGoal || []
  );

  useEffect(() => {
    setLocalSprintGoals(sprint?.sprintGoal || []);
  }, [sprint?.id, sprint?.sprintGoal]);

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

  // Functions -> Sprint
  const handleCreateSprint = useCallback(
    createSprintHandler(createSprint, addOnListOfSprints),
    [createSprint, addOnListOfSprints]
  );

  const handleChangeSprint = useCallback(
    changeSprintHandler(listOfSprints, sprint, setSprint),
    [listOfSprints, sprint, setSprint]
  );

  const handleDeleteSprint = useCallback(
    deleteSprintHandler(deleteSprint, removeSprintFromState),
    [deleteSprint, removeSprintFromState]
  );

  // Functions -> Goal Board -> Sprint Goal
  // const handleCreateSprintGoal = async (data: Partial<SprintGoal>) => {
  //   createSprintGoalHandler(data);
  // };
  const handleCreateSprintGoal = useCallback(
    createSprintGoalHandler(
      createSprintGoal,
      setSprint,
      setOpenCreateSprintGoalDialog,
      sprint?.id,
      setLocalSprintGoals
    ),
    [
      createSprintGoal,
      setSprint,
      setOpenCreateSprintGoalDialog,
      sprint?.id,
      setLocalSprintGoals
    ]
  );

  const handleDeleteSprintGoal = useCallback(
    deleteSprintGoalHandler(deleteSprintGoal, setSprint, setLocalSprintGoals),
    [deleteSprintGoal, setSprint, setLocalSprintGoals]
  );

  const handleEditSprintGoal = useCallback(
    editSprintGoalHandler(
      updateSprintGoal,
      selectedSprintGoal,
      setSprint,
      setOpenEditSprintGoalDialog,
      setLocalSprintGoals
    ),
    [
      updateSprintGoal,
      selectedSprintGoal,
      setSprint,
      setOpenEditSprintGoalDialog,
      setLocalSprintGoals
    ]
  );

  const handleCreateGoalTask = useCallback(
    createTaskToSprintGoalHandler(
      createGoalTask,
      setSprint,
      setOpenCreateGoalTaskDialog,
      setLocalSprintGoals,
      selectedSprintGoal
    ),
    [
      createGoalTask,
      setSprint,
      setOpenCreateGoalTaskDialog,
      setLocalSprintGoals,
      selectedSprintGoal
    ]
  );

  const handleEditGoalTask = useCallback(
    editGoalTaskHandler(
      updateGoalTask,
      setSprint,
      setLocalSprintGoals,
      setOpenEditGoalTaskDialog,
      selectedGoalTask
    ),
    [
      updateGoalTask,
      setSprint,
      setLocalSprintGoals,
      setOpenEditGoalTaskDialog,
      selectedGoalTask
    ]
  );

  const handleDeleteGoalTask = useCallback(
    deleteGoalTaskHandler(
      deleteGoalTask,
      setSprint,
      setLocalSprintGoals,
      setOpenEditGoalTaskDialog
    ),
    [deleteGoalTask, setSprint, setLocalSprintGoals, setOpenEditGoalTaskDialog]
  );

  const handleToggleGoalTaskCompletion = useCallback(
    toggleTaskCompletionHandler(
      updateGoalTask,
      updateSprintGoal,
      setSprint,
      setLocalSprintGoals
    ),
    [updateGoalTask, updateSprintGoal, setSprint, setLocalSprintGoals]
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
                localTickets,
                setLocalTickets,
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
                setTabValue,
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
                localSprintGoals,
                setLocalSprintGoals,
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
          loadingDeleteTask={loadingDeleteTask}
          loadingPostTasks={loadingPostTasks}
          loadingUpdateTask={loadingUpdateTask}
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
          loadingDeleteTicket={loadingDeleteTicket}
          loadingPostTickets={loadingPostTickets}
          loadingUpdateTickets={loadingUpdateTickets}
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
          loadingCreateSprint={loadingDeleteSprint}
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
