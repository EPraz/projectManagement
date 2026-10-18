import { styled } from "@mui/material/styles";
import { Box, Table, TableCell } from "@mui/material";
export const BoardContainer = styled(Box)(({ theme }) => ({
  minWidth: 0,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
}));
export const TableWrapper = styled(Box)(() => ({
  overflow: "auto",
  maxHeight: "min(74dvh,900px)",
  position: "relative",
}));
export const StyledTable = styled(Table)(() => ({
  borderCollapse: "separate",
  borderSpacing: 0,
  tableLayout: "fixed",
}));
export const HeaderCell = styled(TableCell)(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 3,
  background: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  whiteSpace: "nowrap",
  width: 230,
  minWidth: 230,
  padding: "16px",
  "&:first-of-type": { left: 0, zIndex: 4, width: 300, minWidth: 300 },
}));
export const BodyCell = styled(TableCell)(({ theme }) => ({
  position: "sticky",
  left: 0,
  zIndex: 2,
  background: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  width: 300,
  minWidth: 300,
  padding: 16,
  verticalAlign: "top",
}));
export const BodyCellTask = styled(TableCell)(({ theme }) => ({
  background: theme.palette.background.default,
  borderRight: `1px solid ${theme.palette.divider}`,
  padding: 12,
  verticalAlign: "top",
  width: 230,
  minWidth: 230,
}));
