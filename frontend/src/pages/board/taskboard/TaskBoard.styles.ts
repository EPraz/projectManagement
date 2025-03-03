import { alpha, styled } from "@mui/material/styles";
import { Table, TableCell, Box, Select, Chip, Paper } from "@mui/material";
import { TicketPriority, TicketType } from "../../../constants";
import { ticketColors } from "../../../helpers";

export const BoardContainer = styled(Box)(({ theme }) => ({
  height: "calc(100vh - 130px)", // Adjust based on your header/footer heights
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  overflow: "hidden", // Important: contains the overflow
  marginRight: theme.spacing(0.35),
}));

export const TableWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: "auto", // Enable scrolling
  position: "relative",
  // Custom scrollbar styling
  "&::-webkit-scrollbar": {
    width: 8,
    height: 8,
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.background.default,
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.grey[400],
    borderRadius: 4,
    "&:hover": {
      backgroundColor: theme.palette.grey[500],
    },
  },
}));

export const StyledTable = styled(Table)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderCollapse: "separate",
  borderSpacing: 0,
  "& .MuiTableCell-root": {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

export const HeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRight: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1.5, 2),
  fontWeight: 600,
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  position: "sticky",
  top: 0,
  zIndex: 2,
  // "&:first-of-type": {
  //   minWidth: "215px",
  //   width: "215px",
  // },
  // "&:not(:first-of-type)": {
  //   minWidth: "175px",
  //   width: "175px",
  // },
}));

export const BodyCell = styled(TableCell)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1),
  verticalAlign: "top",
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:first-of-type": {
    minWidth: "215px",
    width: "215px",
  },
  "&:not(:first-of-type)": {
    minWidth: "175px",
    width: "175px",
  },
}));

export const OrderButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  marginRight: theme.spacing(1),
  flexDirection: "column",
}));

export const StyledCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "type",
})<{ type: TicketType | TicketPriority }>(({ theme, type }) => ({
  display: "flex",
  width: "215px",
  position: "relative",
  padding: theme.spacing(2),
  gap: theme.spacing(2),
  transition: "all 0.2s ease-in-out",
  cursor: "pointer",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: alpha(ticketColors[type] || theme.palette.grey[400], 0.8),
  },
  "&:hover": {
    transform: "translateY(-2px)",
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[4],
  },
}));

export const TicketInfo = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export const TicketHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const TicketTitle = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  textTransform: "capitalize",
}));

export const TicketMetrics = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginTop: theme.spacing(1),
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

export const StyledSelect = styled(Select)(({ theme }) => ({
  minWidth: 130,
  "& .MuiSelect-select": {
    padding: theme.spacing(0.5, 1),
    fontSize: "0.875rem",
  },
}));

export const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "statusColor",
})<{ statusColor: string }>(({ statusColor }) => ({
  height: 24,
  fontSize: "0.75rem",
  backgroundColor: `${statusColor}14`,
  color: statusColor,
  fontWeight: 500,
  "& .MuiChip-label": {
    padding: "0 8px",
  },
}));

export const PriorityChip = styled(Chip)(() => ({
  height: 24,
  fontSize: "0.75rem",
  fontWeight: 500,
}));
