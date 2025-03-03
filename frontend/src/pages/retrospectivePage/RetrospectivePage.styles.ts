import { Box, Card } from "@mui/material";
import styled from "styled-components";

export const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  width: "100%",
}));

export const Header = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

export const ColumnsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(3),
  flex: 1,
  overflowX: "auto",
  padding: theme.spacing(0.5),
  "&::-webkit-scrollbar": {
    height: 8,
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.background.default,
    borderRadius: 4,
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.grey[300],
    borderRadius: 4,
    "&:hover": {
      backgroundColor: theme.palette.grey[400],
    },
  },
}));

export const Column = styled(Card)(({ theme }) => ({
  flex: 1,
  minWidth: 350,
  maxWidth: 450,
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

export const ColumnHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const ColumnTitle = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const ColumnContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  overflowY: "auto",
  maxHeight: "calc(100vh - 300px)",
  "&::-webkit-scrollbar": {
    width: 6,
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
}));

export const RetroCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "isBlurred",
})<{ isBlurred?: boolean }>(({ theme, isBlurred }) => ({
  position: "relative",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
  "& .content": {
    filter: isBlurred ? "blur(4px)" : "none",
    transition: "filter 0.2s ease-in-out",
  },
}));

export const CardHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const CardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  wordBreak: "break-word",
}));

export const CardFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderTop: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
}));
