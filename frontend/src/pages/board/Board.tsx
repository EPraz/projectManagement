import React from "react";
import { Box, Divider, Tooltip } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { useOutletContext } from "react-router-dom";

import StatusConfig from "../../components/statusConfig/StatusConfig";
import { SprintSelector } from "../../components";
import type { LayoutContextProps } from "../../types";
import BoardHeaderComponent from "./backlogBoard/BoardHeader";
import {
  ActionContainer,
  AddButton,
  AddButtonWrapper,
  BoardContainer,
  BoardHeader,
  TabButton,
  TabsWrapper,
} from "./Board.styles";
import { backlogColumns, TabPanels } from "../../constants";

const Board = () => {
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
    handleChangeTabValue,
    selectedTasksStatuses,
    setSelectedTasksStatuses,
    setOpenCreateSprintGoalDialog,
  } = useOutletContext<LayoutContextProps>();

  const isDisabled = !listOfSprints?.length;

  return (
    <BoardContainer>
      <BoardHeader>
        <TabsWrapper>
          {TabPanels.map((tab, index) => (
            <TabButton
              key={tab.label}
              active={tabValue === index}
              onClick={() => handleChangeTabValue(index)}
            >
              {React.cloneElement(tab.icon, { fontSize: "small" })}
              {tab.label}
            </TabButton>
          ))}

          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ borderColor: "#888888" }}
          />

          {tabValue === 0 && (
            <ActionContainer>
              <AddButtonWrapper>
                <Tooltip
                  title={isDisabled ? "You must create a Sprint first" : ""}
                  arrow
                  placement="bottom"
                >
                  <span>
                    <AddButton
                      onClick={() =>
                        !isDisabled && setOpenCreateTicketDialog(true)
                      }
                      disabled={isDisabled}
                    >
                      Add New Item
                      <AddIcon fontSize="small" />
                    </AddButton>
                  </span>
                </Tooltip>
              </AddButtonWrapper>
            </ActionContainer>
          )}

          {tabValue === 3 && (
            <ActionContainer>
              <AddButtonWrapper>
                <Tooltip
                  title={isDisabled ? "You must create a Sprint first" : ""}
                  arrow
                  placement="bottom"
                >
                  <span>
                    <AddButton
                      onClick={() =>
                        !isDisabled && setOpenCreateSprintGoalDialog(true)
                      }
                      disabled={isDisabled}
                    >
                      Add New Goal
                      <AddIcon fontSize="small" />
                    </AddButton>
                  </span>
                </Tooltip>
              </AddButtonWrapper>
            </ActionContainer>
          )}
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ borderColor: "#888888" }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <SprintSelector />

            {tabValue === 0 && (
              <Box sx={{ marginLeft: "auto" }}>
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{ borderColor: "#888888" }}
                />

                <StatusConfig
                  selectedStatuses={selectedTasksStatuses}
                  setSelectedStatuses={setSelectedTasksStatuses}
                  items={project?.taskStatuses}
                />
              </Box>
            )}

            {tabValue === 1 && (
              <BoardHeaderComponent
                columns={backlogColumns}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
                onApplyFilter={handleApplyFilter}
                filters={filters}
                setFilters={setFilters}
                project={project}
              />
            )}
          </Box>
        </TabsWrapper>
      </BoardHeader>

      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {TabPanels[tabValue].component()}
      </Box>
    </BoardContainer>
  );
};

export default Board;
