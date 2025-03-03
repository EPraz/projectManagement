import { Box, Card, TableCell } from "@mui/material";
import styled from "styled-components";

export const Container = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
}));

export const Header = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}));

export const SearchBar = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",
  },
}));

export const TableWrapper = styled(Card)(({ theme }) => ({
  flex: 1,
  overflow: "hidden",
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
