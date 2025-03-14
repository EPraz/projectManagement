import { alpha, styled } from "@mui/material/styles";
import {
  Table,
  TableCell,
  Box,
  Select,
  Chip,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import { TicketPriority, TicketType } from "../../../../constants";
import { ticketColors } from "../../../../helpers";

export const BoardContainer = styled(Box)(({ theme }) => ({
  height: "calc(95vh - 130px)", // Adjust based on your header/footer heights
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

// ***************************************************** //
// Task Column
// ***************************************************** //

export const BodyCellTask = styled(TableCell)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1),
  verticalAlign: "top",
  minWidth: "175px",
  maxWidth: "360px",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const TaskContainer = styled("div")(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(1),
  alignItems: "start",
  justifyContent: "center",
  width: "100%",

  gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
}));

export const AddTaskButton = styled(IconButton)(({ theme }) => ({
  height: "35px",
  width: "35px",
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: "50%",
  color: theme.palette.primary.main,
  margin: `${theme.spacing(2)} auto 0`, // Centrado y espaciado superior
  display: "flex",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

// ***************************************************** //
// Task Column
// ***************************************************** //

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

// export const StyledSelectTaskCard = styled(Select)(({ theme }) => ({
//   fontSize: "0.75rem",
//   height: "24px",
//   minWidth: "80px",
//   maxWidth: "120px",
//   "& .MuiSelect-select": {
//     padding: theme.spacing(0, 1),
//     paddingRight: "24px !important", // Espacio para el icono
//     height: "24px",
//     display: "flex",
//     alignItems: "center",
//   },
//   "& .MuiOutlinedInput-notchedOutline": {
//     borderColor: theme.palette.divider,
//   },
//   "&:hover .MuiOutlinedInput-notchedOutline": {
//     borderColor: theme.palette.primary.main,
//   },
//   "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//     borderColor: theme.palette.primary.main,
//     borderWidth: 1,
//   },
//   "& .MuiSelect-icon": {
//     fontSize: "1rem",
//   },
// }));

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

// export const MetricItem = styled(Box)(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   gap: theme.spacing(0.5),
//   color: theme.palette.text.secondary,
//   "& svg": {
//     fontSize: "1rem",
//   },
// }));

export const TaskFooter = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: theme.spacing(1),
  gap: theme.spacing(1),
}));
