import { styled } from "@mui/material/styles";
import {
  Box,
  Paper,
  Select,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

export const BoardContainer = styled(Paper)(({ theme }) => ({
  // height: "calc(100vh - 100px)",
  height: "calc(90vh - 108px)",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "4px",
  overflow: "hidden",
}));

export const BoardHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 16px",
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: "8px 16px",
  fontSize: "14px",
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&.header": {
    backgroundColor: theme.palette.background.default,
    fontWeight: 500,
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "& > td": {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

export const StateIndicator = styled("span")<{
  statusColor?: string;
}>(({ theme, statusColor }) => ({
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  display: "inline-block",
  marginRight: "8px",
  backgroundColor: statusColor ? statusColor : theme.palette.grey[400],
}));

export const TagChip = styled(Box)(({ theme }) => ({
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "12px",
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.secondary,
  margin: "0 4px",
}));

export const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  padding: theme.spacing(1, 2),
  // backgroundColor: theme.palette.background.paper,
  // borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const FilterContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  minWidth: 280,
  "& > *:not(:last-child)": {
    marginBottom: theme.spacing(2),
  },
}));

export const FilterLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 500,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

export const StyledSelect = styled(Select)(({ theme }) => ({
  width: "100%",
  "& .MuiSelect-select": {
    padding: theme.spacing(1),
  },
}));

export const ColumnToggleContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  minWidth: 250,
}));

export const ColumnToggleHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  paddingBottom: theme.spacing(1),
}));

export const ColumnToggleItem = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(0.5, 0),
}));
