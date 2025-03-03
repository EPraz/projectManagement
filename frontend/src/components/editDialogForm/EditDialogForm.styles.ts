import {
  Dialog,
  Box,
  styled,
  TextareaAutosize,
  Avatar,
  Typography,
  Grid2,
} from "@mui/material";

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    maxHeight: "90vh",
    height: "90vh",
    margin: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
    boxShadow: theme.shadows[3],
  },
}));

export const typeColors = {
  "Product Backlog Item": "#0078d4",
  Task: "#666666",
  Bug: "#da3b01",
  Feature: "#13a10e",
  Epic: "#8764b8",
} as const;

export const HeaderTitle = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  "& span": {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
});

export const HeaderActions = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const TaskTitle = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  "& .MuiTextField-root": {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "transparent",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
      "&.Mui-focused": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  },
}));

export const TaskTitleText = styled(Box)({
  color: "#666",
  marginRight: "8px",
  fontSize: "0.875rem",
});

export const MainContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flex: 1,
  overflow: "hidden",
  backgroundColor: theme.palette.background.default,
}));

export const LeftPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: "auto",
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export const RightPanel = styled(Box)(({ theme }) => ({
  width: "300px",
  overflow: "auto",
  backgroundColor: theme.palette.background.paper,
  borderLeft: `1px solid ${theme.palette.divider}`,
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1.5, 2),
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const SectionTitle = styled(Box)({
  fontWeight: 500,
  fontSize: "0.875rem",
});

export const SectionContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  "& .MuiTextField-root": {
    marginBottom: theme.spacing(2),
  },
}));

export const DetailSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const DetailTitle = styled(Box)(({ theme }) => ({
  fontWeight: 500,
  marginBottom: theme.spacing(2),
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
}));

export const FieldContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiTextField-root": {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      transition: "all 0.2s ease-in-out",
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
      "&.Mui-focused": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  },
}));

export const FieldWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const FieldLabel = styled(Box)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
  fontWeight: 500,
}));

export const FieldContent = styled(Box)(({ theme }) => ({
  "& .MuiTextField-root": {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      backgroundColor: "transparent",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
      "&.Mui-focused": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  },
}));

export const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  width: "100%",
  minHeight: "100px",
  padding: "8px 12px",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  fontFamily: "inherit",
  fontSize: "0.875rem",
  resize: "vertical",
  backgroundColor: "transparent",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
  },
  "&:focus": {
    outline: "none",
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

export const UserAvatar = styled(Box)(({ theme }) => ({
  width: 28,
  height: 28,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.75rem",
  fontWeight: 500,
}));

export const ActionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  "& .MuiButton-root": {
    textTransform: "none",
    fontWeight: 500,
  },
}));

export const MenuButton = styled(Box)(({ theme }) => ({
  "& .MuiIconButton-root": {
    color: theme.palette.text.secondary,
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

export const TabsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(0, 2),
}));

export const Tab = styled(Box)<{ active?: boolean }>(({ theme, active }) => ({
  padding: theme.spacing(1, 2),
  cursor: "pointer",
  fontSize: "0.875rem",
  fontWeight: 500,
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  borderBottom: `2px solid ${
    active ? theme.palette.primary.main : "transparent"
  }`,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

export const DialogHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== "categoryType",
})<{ categoryType: keyof typeof typeColors }>(({ theme, categoryType }) => ({
  backgroundColor:
    typeColors[categoryType] || typeColors["Product Backlog Item"],
  color: theme.palette.common.white,
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "background-color 0.2s ease-in-out",
}));

export const TopSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export const UserSection = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

export const UserInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const StyledUserAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  width: 32,
  height: 32,
  fontSize: "0.875rem",
  fontWeight: 500,
}));

export const UpdatedByText = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  color: theme.palette.text.secondary,
  fontStyle: "italic",
  marginTop: theme.spacing(1),
}));

export const TopFieldsSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.grey[50],
}));

export const GridContainer = styled(Grid2)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "flex-start",
}));
