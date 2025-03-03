"use client";

import { useState } from "react";
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

interface SprintGoal {
  id: number;
  title: string;
  description: string;
  progress: number;
  status: "completed" | "in-progress" | "at-risk";
  tasks: {
    id: number;
    title: string;
    completed: boolean;
  }[];
}

const mockData: SprintGoal[] = [
  {
    id: 1,
    title: "Complete User Authentication Flow",
    description: "Implement secure login, registration, and password recovery",
    progress: 75,
    status: "in-progress",
    tasks: [
      { id: 1, title: "Implement login form", completed: true },
      { id: 2, title: "Add password recovery", completed: true },
      { id: 3, title: "Set up email verification", completed: false },
      { id: 4, title: "Add social login options", completed: false },
    ],
  },
  {
    id: 2,
    title: "Optimize Application Performance",
    description: "Improve loading times and reduce API response time",
    progress: 30,
    status: "at-risk",
    tasks: [
      { id: 5, title: "Analyze current performance", completed: true },
      { id: 6, title: "Implement caching", completed: false },
      { id: 7, title: "Optimize database queries", completed: false },
    ],
  },
];

const statusConfig = {
  completed: { color: "success", label: "Completed" },
  "in-progress": { color: "primary", label: "In Progress" },
  "at-risk": { color: "error", label: "At Risk" },
} as const;

const GoalBoard = () => {
  const [goals, setGoals] = useState<SprintGoal[]>(mockData);

  return (
    <BoardContainer>
      <Header>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            Sprint Goals
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Jun 11 - Jun 29 · Sprint 1
          </Typography>
        </Box>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          sx={{
            px: 3,
            py: 1,
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Add goal
        </Button>
      </Header>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {goals.map((goal) => (
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
                    label={statusConfig[goal.status].label}
                    color={statusConfig[goal.status].color as any}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                  <Tooltip title="Edit goal" arrow>
                    <ActionButton size="small">
                      <EditIcon fontSize="small" />
                    </ActionButton>
                  </Tooltip>
                  <Tooltip title="Delete goal" arrow>
                    <DeleteButton size="small">
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
                  color={statusConfig[goal.status].color as any}
                />
              </GoalProgress>

              <TaskList dense>
                {goal.tasks.map((task) => (
                  <ListItem
                    key={task.id}
                    secondaryAction={
                      <Tooltip title="Edit task" arrow>
                        <ActionButton edge="end" size="small">
                          <EditIcon fontSize="small" />
                        </ActionButton>
                      </Tooltip>
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
                      <ActionButton size="small" sx={{ mr: 1 }}>
                        {task.completed ? (
                          <CheckCircleIcon color="success" fontSize="small" />
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
                ))}
              </TaskList>
            </GoalContent>
          </GoalCard>
        ))}
      </Box>
    </BoardContainer>
  );
};
export default GoalBoard;
