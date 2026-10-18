import { Box, Button, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useOutletContext } from "react-router-dom";
import StatusConfig from "../../components/statusConfig/StatusConfig";
import type { LayoutContextProps } from "../../types";
import { backlogColumns } from "../../constants";
import { TabPanels } from "../../constants/tabPanels";
import DeferredSurface from "../../components/deferredSurface/DeferredSurface";
import BoardHeader from "./components/backlogBoard/boardHeader/BoardHeader";
export default function Board() {
  const {
    project,
    setOpenCreateTicketDialog,
    listOfSprints,
    visibleColumns,
    setVisibleColumns,
    filters,
    setFilters,
    handleApplyFilter,
    tabValue,
    selectedTasksStatuses,
    setSelectedTasksStatuses,
    setOpenCreateSprintGoalDialog,
  } = useOutletContext<LayoutContextProps>();
  const Panel = TabPanels[tabValue].component;
  const disabled = !listOfSprints?.length;
  return (
    <Box sx={{ minWidth: 0 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="overline" color="primary">
            {tabValue === 0 || tabValue === 1 ? "Work" : "Planning"} / Selected
            sprint
          </Typography>
          <Typography component="h1" variant="h1">
            {tabValue === 0 ? "Taskboard" : TabPanels[tabValue].label}
            <Box component="span" sx={{ color: "primary.main" }}>
              .
            </Box>
          </Typography>
        </Box>
        {(tabValue === 0 || tabValue === 1 || tabValue === 3) && (
          <Tooltip title={disabled ? "You must create a Sprint first" : ""}>
            <span>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                disabled={disabled}
                onClick={() =>
                  tabValue === 3
                    ? setOpenCreateSprintGoalDialog(true)
                    : setOpenCreateTicketDialog(true)
                }
              >
                {tabValue === 3 ? "Add New Goal" : "Add New Item"}
              </Button>
            </span>
          </Tooltip>
        )}
        {tabValue === 0 && (
          <StatusConfig
            selectedStatuses={selectedTasksStatuses}
            setSelectedStatuses={setSelectedTasksStatuses}
            items={project?.taskStatuses}
          />
        )}
      </Box>
      {tabValue === 1 && (
        <BoardHeader
          columns={backlogColumns}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          onApplyFilter={handleApplyFilter}
          filters={filters}
          setFilters={setFilters}
          project={project}
        />
      )}
      <DeferredSurface key={tabValue} label={TabPanels[tabValue].label}>
        <Panel />
      </DeferredSurface>
    </Box>
  );
}
