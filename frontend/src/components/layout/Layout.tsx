import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useProject, useSprint } from "../../context";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import {
  useBulkUpdateTickets,
  useCreateSprint,
  useCreateTask,
  useCreateTicket,
  useDeleteSprint,
  useDeleteTask,
  useDeleteTicket,
  useUpdateTask,
  useUpdateTicket,
} from "../../hooks";
import { useCallback, useEffect, useState } from "react";
import { FilterProps, Sprint, Task, TaskStatus, Ticket } from "../../types";
import {
  changeSprintHandler,
  createSprintHandler,
  createTaskHandler,
  createTicketHandler,
  deleteSprintHandler,
  deleteTaskHandler,
  deleteTicketHandler,
  editTaskHandler,
  editTicketHandler,
  onDragEndTaskHandler,
  updateTicketOrderHandler,
  updateTicketStatusHandler,
} from "../../helpers";
import DialogsContainer from "../../pages/board/taskBoard/DialogsContainer";
import { initialBacklogColumns, TabPanels } from "../../constants";
import {
  LayoutRoot,
  LayoutWrapper,
  MainContent,
  PageContent,
} from "./Layout.styles";

const Layout = () => {
  // Providers
  const { project, loading: loadingProject } = useProject();

  const { tickets, sprint, listOfSprints, setSprint, loadTicketsBySprint } =
    useSprint();
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

  // Local States -> Sidebar
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

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

  const handleApplyFilter = (newFilters: any) => {
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
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [tabValue, searchParams, setSearchParams, location.pathname]);

  // Local States -> Sprint
  const [openCreateSprintDialog, setOpenCreateSprintDialog] =
    useState<boolean>(false);
  const [openDeleteSprintDialog, setOpenDeleteSprintDialog] =
    useState<boolean>(false);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);

  // Functions

  // Functions -> Tickets
  const handleCreateTicket = useCallback(
    createTicketHandler(
      createTicket,
      setOpenCreateTicketDialog,
      setLocalTickets,
      sprint?.id
    ),
    [createTicket, setOpenCreateTicketDialog, setLocalTickets, sprint?.id]
  );

  const handleEditTicket = useCallback(
    editTicketHandler(updateTicket, setLocalTickets, localTickets, tickets),
    [updateTicket, setLocalTickets, localTickets, tickets]
  );

  const handleDeleteTicket = useCallback(
    deleteTicketHandler(deleteTicket, setLocalTickets, localTickets, tickets),
    [deleteTicket, setLocalTickets, localTickets, tickets]
  );

  const handleUpdateTicketOrder = useCallback(
    updateTicketOrderHandler(setLocalTickets, localTickets, bulkUpdateTickets),
    [setLocalTickets, localTickets, updateTicket]
  );

  const handleUpdateTicketStatus = useCallback(
    updateTicketStatusHandler(
      updateTicket,
      setLocalTickets,
      localTickets,
      tickets
    ),
    [updateTicket, setLocalTickets, localTickets, tickets]
  );

  // Functions -> Tasks
  const handleCreateTask = useCallback(
    createTaskHandler(
      createTask,
      setOpenTaskDialog,
      setLocalTickets,
      selectedTicketId
    ),
    [createTask, setOpenTaskDialog, setLocalTickets, selectedTicketId]
  );

  const handleEditTask = useCallback(
    editTaskHandler(updateTask, setLocalTickets, localTickets, tickets),
    [updateTask, setLocalTickets, localTickets, tickets]
  );

  const handleDeleteTask = useCallback(
    deleteTaskHandler(deleteTask, setLocalTickets, localTickets, tickets),
    [deleteTask, setLocalTickets, localTickets, tickets]
  );

  const handleOnDragEndTask = useCallback(
    onDragEndTaskHandler(
      updateTask,
      setLocalTickets,
      localTickets,
      tickets,
      project?.taskStatuses
    ),
    [updateTask, setLocalTickets, localTickets, tickets, project?.taskStatuses]
  );

  // Functions -> Sprint
  const handleCreateSprint = useCallback(
    createSprintHandler(
      createSprint,
      setSprint,
      setOpenCreateSprintDialog,
      sprint
    ),
    [createSprint, setSprint, setOpenCreateSprintDialog, sprint]
  );

  const handleChangeSprint = useCallback(
    changeSprintHandler(listOfSprints, sprint, setSprint, loadTicketsBySprint),
    [listOfSprints, sprint, setSprint, loadTicketsBySprint]
  );

  const handleDeleteSprint = useCallback(
    deleteSprintHandler(deleteSprint, setSprint),
    [deleteSprint, setSprint]
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
          <Header projectName={project?.title!} projectId={project?.id!} />
          <PageContent>
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
        />
      </LayoutRoot>
    </LayoutWrapper>
  );
};

export default Layout;
