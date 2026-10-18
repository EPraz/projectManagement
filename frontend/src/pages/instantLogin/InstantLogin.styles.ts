import { Box, Paper, styled } from "@mui/material";

export const AuthWrapper = styled(Box)(({ theme }) => ({
  minHeight: "100dvh",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  padding: theme.spacing(3, 2),
  [theme.breakpoints.up("sm")]: { padding: theme.spacing(4, 5) },
}));
export const AuthLayout = styled(Box)(({ theme }) => ({
  maxWidth: 1120,
  margin: "0 auto",
  minHeight: "calc(100dvh - 64px)",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("sm")]: { minHeight: "calc(100dvh - 48px)" },
}));
export const EntryGrid = styled("main")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(0,1fr)",
  gap: theme.spacing(4),
  padding: theme.spacing(5, 0, 3),
  margin: "auto 0",
  alignItems: "center",
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "minmax(0,1.15fr) minmax(0,1fr)",
    gap: theme.spacing(8),
    padding: theme.spacing(8, 0),
  },
}));
export const AuthCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: -1,
    left: theme.spacing(3),
    right: theme.spacing(3),
    height: 3,
    backgroundColor: theme.palette.primary.main,
  },
  [theme.breakpoints.up("sm")]: { padding: theme.spacing(4) },
}));
export const Form = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));
