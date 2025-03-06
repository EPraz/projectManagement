import { alpha, Box, Paper, Select, Typography } from "@mui/material";
import styled from "styled-components";

export const TaskPaper = styled(Paper)<{ isdragging: boolean }>(
  ({ theme, isdragging }) => ({
    position: "relative",
    maxWidth: "200px",
    display: "flex",
    padding: theme.spacing(1.5, 1),
    marginBottom: theme.spacing(1),
    backgroundColor: isdragging
      ? alpha(theme.palette.background.paper, 0.8)
      : theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    cursor: "pointer",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 3,
      backgroundColor: "#efb810",
    },
    "&:hover": {
      borderColor: theme.palette.primary.main,
      boxShadow: theme.shadows[2],
    },
  })
);

export const StyledSelect = styled(Select)(({ theme }) => ({
  fontSize: "0.75rem",
  height: "24px",
  minWidth: "80px",
  maxWidth: "120px",
  "& .MuiSelect-select": {
    padding: theme.spacing(0, 1),
    paddingRight: "24px !important", // Espacio para el icono
    height: "24px",
    display: "flex",
    alignItems: "center",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.divider,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
    borderWidth: 1,
  },
  "& .MuiSelect-icon": {
    fontSize: "1rem",
  },
}));

export const DragHandle = styled(Box)(({ theme }) => ({
  cursor: "grab",
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  color: theme.palette.text.disabled,
  transition: "color 0.2s ease-in-out",
  "&:hover": {
    color: theme.palette.primary.main,
  },
  "&:active": {
    cursor: "grabbing",
  },
}));

export const TaskContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  minWidth: 0, // Para que funcione el text overflow
}));

export const TaskHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: theme.spacing(1),
}));

export const TaskTitle = styled(Typography)(() => ({
  fontWeight: 500,
  lineHeight: 1.3,
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
}));

export const TaskMetrics = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginTop: theme.spacing(0.5),
}));

export const MetricItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  "& svg": {
    fontSize: "1rem",
  },
}));

export const TaskFooter = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: theme.spacing(1),
  gap: theme.spacing(1),
}));
