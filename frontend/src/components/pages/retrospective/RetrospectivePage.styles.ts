import { Box, Button, Card, styled } from "@mui/material";

export const Container = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
  gap: theme.spacing(3),
  padding: theme.spacing(3),
}));

export const Header = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  borderLeft: `4px solid ${theme.palette.primary}`,
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
  minWidth: 300,
  maxWidth: "none", // Remove max-width to allow columns to expand
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
  minHeight: "72px", // Add minimum height to maintain consistent layout when names are hidden
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

export const LikeButton = styled(Button)(({ theme, color }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5, 1.5),
  color: color,
  minWidth: "auto",
  "& .MuiButton-startIcon": {
    marginRight: theme.spacing(0.5),
  },
}));

export const EmptyColumnMessage = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  color: theme.palette.text.secondary,
  textAlign: "center",
  height: "100%",
  minHeight: "200px",
}));

export const LikedByTooltip = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  "& ul": {
    margin: 0,
    padding: 0,
    paddingLeft: theme.spacing(2),
  },
  "& li": {
    margin: theme.spacing(0.5, 0),
  },
}));
