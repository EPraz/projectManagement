import { Box, Button, Card, styled } from "@mui/material";

export const Container = styled(Box)(({ theme }) => ({
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
}));
export const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2.5),
  minWidth: 0,
}));
export const ColumnsContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: theme.spacing(2.5),
  minWidth: 0,
  [theme.breakpoints.up("lg")]: {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    alignItems: "start",
  },
}));
export const Column = styled(Card)(({ theme }) => ({
  minWidth: 0,
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
}));
export const ColumnHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  gap: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));
export const ColumnTitle = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  width: "100%",
  minWidth: 0,
}));
export const ColumnContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  minWidth: 0,
}));
export const RetroCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "isBlurred",
})<{ isBlurred?: boolean }>(({ theme, isBlurred }) => ({
  minWidth: 0,
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.default,
  "& .content": { filter: isBlurred ? "blur(4px)" : "none" },
}));
export const CardHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2, 0),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  minWidth: 0,
}));
export const CardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  overflowWrap: "anywhere",
}));
export const CardFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 1, 1, 2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.spacing(1),
}));
export const LikeButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  minWidth: 44,
  minHeight: 44,
  padding: theme.spacing(0.5, 1),
}));
export const EmptyColumnMessage = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 1),
  color: theme.palette.text.secondary,
  textAlign: "center",
  minWidth: 0,
}));
export const LikedByTooltip = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  "& ul": { margin: 0, paddingLeft: theme.spacing(2) },
  "& li": { margin: theme.spacing(0.5, 0) },
}));
