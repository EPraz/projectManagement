import {
  Box,
  IconButton,
  LinearProgress,
  Table,
  TableCell,
  Typography,
  styled,
} from "@mui/material";

// Primary color (60%) - Main UI elements
// Secondary color (30%) - Supporting elements
// Accent color (10%) - Highlights and calls to action

export const BoardContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  height: "100%",
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
}));

export const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

export const StyledTableContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  overflow: "hidden",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  "& .MuiTableContainer-root": {
    maxHeight: "calc(100vh - 280px)",
    overflow: "auto",
  },
  "& .MuiTableContainer-root::-webkit-scrollbar": {
    width: 8,
    height: 8,
  },
  "& .MuiTableContainer-root::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.background.default,
  },
  "& .MuiTableContainer-root::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.grey[300],
    borderRadius: 4,
    "&:hover": {
      backgroundColor: theme.palette.grey[400],
    },
  },
}));

export const StyledTable = styled(Table)(({ theme }) => ({
  borderCollapse: "separate",
  borderSpacing: 0,
}));

export const TableHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  fontWeight: 600,
  padding: theme.spacing(1.5, 2),
  borderBottom: `2px solid ${theme.palette.divider}`,
  whiteSpace: "nowrap",
  position: "sticky",
  top: 0,
  zIndex: 1,
}));

export const TableBodyCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  transition: "background-color 0.2s ease",
}));

export const MemberCell = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

export const MemberName = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

export const ProgressCell = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  width: 180,
}));

export const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  width: 100,
  height: 8,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[200],
  "& .MuiLinearProgress-bar": {
    borderRadius: theme.shape.borderRadius,
    backgroundImage: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
  },
}));

export const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  width: 32,
  height: 32,
  marginLeft: theme.spacing(0.5),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "& .MuiSvgIcon-root": {
    fontSize: 18,
  },
}));

export const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(6),
  textAlign: "center",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `1px dashed ${theme.palette.divider}`,
  margin: theme.spacing(2, 0),
}));

export const CapacityMetric = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[2],
  },
}));

export const MetricValue = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1.25rem",
  color: theme.palette.secondary.main,
}));

export const MetricLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
}));
