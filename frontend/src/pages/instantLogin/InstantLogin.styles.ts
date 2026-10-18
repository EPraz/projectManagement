import { Box, Card, styled } from "@mui/material";
export const AuthWrapper = styled(Box)(({ theme }) => ({
  minHeight: "100dvh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  position: "relative",
}));
export const AuthCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 1000,
  display: "grid",
  gridTemplateColumns: "1fr",
  overflow: "hidden",
  [theme.breakpoints.up("md")]: { gridTemplateColumns: "1fr 1fr" },
}));
export const LeftSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.sidebar.background,
  color: theme.palette.sidebar.text,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minHeight: 280,
  [theme.breakpoints.up("md")]: { padding: theme.spacing(6), minHeight: 540 },
}));
export const RightSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.up("sm")]: { padding: theme.spacing(4) },
}));
export const Form = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));
export const WelcomeText = styled(Box)({
  "& h1": {
    fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: 500,
    lineHeight: 1.15,
    letterSpacing: "-.035em",
    margin: "28px 0 20px",
    overflowWrap: "anywhere",
  },
  "& p": { fontSize: "1rem", lineHeight: 1.7, color: "#bcbcb8", maxWidth: 340 },
});
