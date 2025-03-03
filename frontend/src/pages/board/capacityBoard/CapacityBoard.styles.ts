import {
  Box,
  IconButton,
  LinearProgress,
  Table,
  TableCell,
  TableContainer,
  Typography,
} from "@mui/material";
import styled from "styled-components";

export const BoardContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
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

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  overflow: "hidden",
}));

export const StyledTable = styled(Table)(({ theme }) => ({
  "& .MuiTableCell-head": {
    backgroundColor: theme.palette.background.default,
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  "& .MuiTableCell-body": {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

export const TableHeaderCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  whiteSpace: "nowrap",
}));

export const TableBodyCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
}));

export const MemberCell = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

export const MemberName = styled(Typography)(() => ({
  fontWeight: 500,
}));

export const ProgressCell = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

export const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  width: 100,
  height: 6,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[200],
  "& .MuiLinearProgress-bar": {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.main,
  },
}));

export const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },
}));
