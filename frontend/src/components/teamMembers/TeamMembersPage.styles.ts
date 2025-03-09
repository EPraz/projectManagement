import { Box, Button, Card, TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Container = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(3),
  gap: theme.spacing(3),
}));

export const Header = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

export const SearchBar = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",
  },
}));

export const TableWrapper = styled(Card)(({ theme }) => ({
  flex: 1,
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  "& .MuiTableContainer-root": {
    maxHeight: "calc(100vh - 280px)",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: 6,
      height: 6,
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.grey[300],
      borderRadius: 3,
      "&:hover": {
        backgroundColor: theme.palette.grey[400],
      },
    },
  },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  whiteSpace: "nowrap",
  padding: theme.spacing(2),
  "&.MuiTableCell-head": {
    backgroundColor: theme.palette.background.default,
    fontWeight: 600,
  },
}));

export const MemberInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

export const ProjectsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  flexWrap: "wrap",
}));

// New styles for filter popover
export const FilterContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export const FilterHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const FilterSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const FilterActions = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(1),
  padding: theme.spacing(2),
}));

export const NoResultsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
}));

export const FilterButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "hasActiveFilters",
})<{ hasActiveFilters?: boolean }>(({ theme, hasActiveFilters }) => ({
  height: 40,
  position: "relative",
  borderColor: "secondary.main",
  color: "secondary.main",
  ...(hasActiveFilters && {
    borderColor: "secondary.main",
    color: "white",
    bgcolor: "secondary.main",
    "&:hover": {
      bgcolor: "secondary.dark",
      borderColor: "secondary.dark",
      color: "white",
    },
  }),
}));

export const ActiveFilterCountBox = styled(Box)(() => ({
  position: "absolute",
  top: -8,
  right: -8,
  bgcolor: "error.main",
  color: "white",
  width: 20,
  height: 20,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.75rem",
  fontWeight: "bold",
}));
