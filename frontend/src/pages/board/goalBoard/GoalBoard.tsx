import { memo } from "react";
import {
  Box,
  Typography,
  Button,
  ListItem,
  ListItemText,
  Chip,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import {
  ActionButton,
  BoardContainer,
  DeleteButton,
  GoalCard,
  GoalContent,
  GoalHeader,
  GoalProgress,
  Header,
  StyledLinearProgress,
  TaskList,
} from "./GoalBoard.styles";
import { useOutletContext } from "react-router-dom";

import { GoalTask, LayoutContextProps } from "../../../types";
import { formatDateRange, statusConfig } from "./GoalBoard.helpers";

const GoalBoard = () => {
  const {
    sprint,
    setOpenEditSprintGoalDialog,
    setOpenDeleteSprintGoalDialog,
    setOpenCreateGoalTaskDialog,
    setSelectedSprintGoal,
    localSprintGoals,
    setOpenEditGoalTaskDialog,
    setOpenDeleteGoalTaskDialog,
    setSelectedGoalTask,
    handleToggleGoalTaskCompletion,
  } = useOutletContext<LayoutContextProps>();

  const handleEditGoalTask = (task: GoalTask) => {
    setSelectedGoalTask(task);
    setOpenEditGoalTaskDialog(true);
  };
  const handleDeleteGoalTask = (task: GoalTask) => {
    setSelectedGoalTask(task);
    setOpenDeleteGoalTaskDialog(true);
  };

  return (
    <BoardContainer>
      <Header>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          Sprint Goals
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatDateRange(sprint)}
        </Typography>
      </Header>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {localSprintGoals.length > 0 ? (
          localSprintGoals.map((goal) => {
            const uiStatus = goal.goalsStatus;
            return (
              <GoalCard key={goal.id}>
                <GoalHeader>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {goal.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {goal.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Chip
                        label={
                          statusConfig[uiStatus as keyof typeof statusConfig]
                            ?.label
                        }
                        color={
                          statusConfig[uiStatus as keyof typeof statusConfig]
                            ?.color
                        }
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                      <Tooltip title="Edit goal" arrow>
                        <ActionButton
                          size="small"
                          onClick={() => {
                            setSelectedSprintGoal(goal);
                            setOpenEditSprintGoalDialog(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title="Delete goal" arrow>
                        <DeleteButton
                          size="small"
                          onClick={() => {
                            setSelectedSprintGoal(goal);
                            setOpenDeleteSprintGoalDialog(true);
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </DeleteButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </GoalHeader>

                <GoalContent>
                  <GoalProgress>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        Progress
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        {goal.progress}%
                      </Typography>
                    </Box>
                    <StyledLinearProgress
                      variant="determinate"
                      value={goal.progress}
                      color={
                        statusConfig[uiStatus as keyof typeof statusConfig]
                          ?.color
                      }
                    />
                  </GoalProgress>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      Tasks
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon fontSize="small" />}
                      onClick={() => {
                        setSelectedSprintGoal(goal);
                        setOpenCreateGoalTaskDialog(true);
                      }}
                    >
                      Add Task
                    </Button>
                  </Box>

                  <TaskList dense>
                    {goal.goalTask && goal.goalTask.length > 0 ? (
                      goal.goalTask.map((task) => (
                        <ListItem
                          key={task.id}
                          secondaryAction={
                            <>
                              <Tooltip title="Edit task" arrow>
                                <ActionButton
                                  edge="end"
                                  size="small"
                                  onClick={() => handleEditGoalTask(task)}
                                >
                                  <EditIcon fontSize="small" />
                                </ActionButton>
                              </Tooltip>
                              <Tooltip title="Delete task" arrow>
                                <ActionButton
                                  edge="end"
                                  size="small"
                                  onClick={() => handleDeleteGoalTask(task)}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </ActionButton>
                              </Tooltip>
                            </>
                          }
                        >
                          <Tooltip
                            title={
                              task.completed
                                ? "Mark as incomplete"
                                : "Mark as complete"
                            }
                            arrow
                          >
                            <ActionButton
                              size="small"
                              sx={{ mr: 1 }}
                              onClick={() =>
                                handleToggleGoalTaskCompletion(task)
                              }
                            >
                              {task.completed ? (
                                <CheckCircleIcon
                                  color="success"
                                  fontSize="small"
                                />
                              ) : (
                                <RadioButtonUncheckedIcon fontSize="small" />
                              )}
                            </ActionButton>
                          </Tooltip>
                          <ListItemText
                            primary={task.title}
                            sx={{
                              "& .MuiTypography-root": {
                                textDecoration: task.completed
                                  ? "line-through"
                                  : "none",
                                color: task.completed
                                  ? "text.secondary"
                                  : "text.primary",
                                transition: "all 0.2s ease-in-out",
                              },
                            }}
                          />
                        </ListItem>
                      ))
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ py: 2, textAlign: "center" }}
                      >
                        No tasks added yet
                      </Typography>
                    )}
                  </TaskList>
                </GoalContent>
              </GoalCard>
            );
          })
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No localSprintGoals added yet. Click "Add goal" to create your
              first sprint goal.
            </Typography>
          </Box>
        )}
      </Box>
    </BoardContainer>
  );
};

export default memo(GoalBoard);
