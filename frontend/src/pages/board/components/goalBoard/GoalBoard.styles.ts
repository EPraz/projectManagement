import {
  IconButton,
  LinearProgress,
  List,
  ListItemText,
  styled,
} from "@mui/material";
import { Box } from "@mui/system";

export const BoardContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  backgroundColor: "#f5f5f5",
}));

export const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

export const GoalCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  overflow: "hidden",
  transition: "box-shadow 0.2s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[2],
  },
}));

export const GoalHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const GoalContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const GoalProgress = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
}));

export const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[200],
  "& .MuiLinearProgress-bar": {
    borderRadius: theme.shape.borderRadius,
  },
}));

export const TaskList = styled(List)(({ theme }) => ({
  "& .MuiListItem-root": {
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(0.5),
    transition: "background-color 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

export const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },
}));

export const DeleteButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  "&:hover": {
    backgroundColor: theme.palette.error.main + "14",
    color: theme.palette.error.main,
  },
}));

export const EmptySprintBox = styled(Box)(() => ({
  textAlign: "center",
  py: 4,
}));

export const ListItemTextStyled = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== "completed",
})<{ completed?: boolean }>(({ completed }) => ({
  "& .MuiTypography-root": {
    textDecoration: completed ? "line-through" : "none",
    color: completed ? "text.secondary" : "text.primary",
    transition: "all 0.2s ease-in-out",
  },
}));

export const TaskSectionBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 1,
}));

export const GoalHeaderContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 2,
}));
