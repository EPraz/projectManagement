import {
  Box,
  Chip,
  Dialog,
  Paper,
  styled,
  Tabs,
  Typography,
} from "@mui/material";

export const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: 8,
    overflow: "hidden",
    maxWidth: 1200,
    width: "100%",
  },
}));

export const Header = styled(Box)(({ theme }) => ({
  padding: "16px 24px",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const MainContent = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 300px",
  gap: theme.spacing(3),
  height: "calc(100vh - 200px)",
  overflow: "auto",
}));

export const LeftPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  overflowY: "auto",
}));

export const RightPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: theme.palette.background.default,
  borderLeft: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  overflow: "auto",
}));

export const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 500,
  marginBottom: theme.spacing(2),
}));

export const TimeTrackingGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.spacing(2),
}));

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "& .MuiTab-root": {
    textTransform: "none",
    fontWeight: 500,
    minHeight: 48,
  },
}));

export const PriorityChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "priorityColor",
})<{ priorityColor: string }>(({ priorityColor }) => ({
  backgroundColor: priorityColor,
  color: "#fff",
  fontWeight: 500,
  "& .MuiChip-icon": {
    color: "inherit",
  },
}));
