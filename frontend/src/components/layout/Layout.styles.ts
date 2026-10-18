import { Box, styled } from "@mui/material";
export const LayoutWrapper = styled("div")({
  minHeight: "100dvh",
  width: "100%",
});
export const LayoutRoot = styled("div")({
  width: "100%",
  minWidth: 0,
  minHeight: "100dvh",
});
export const MainContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== "sidebarOpen",
})<{ sidebarOpen: boolean }>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  minHeight: "100dvh",
  padding: theme.spacing(2),
  [theme.breakpoints.up("md")]: { padding: "22px 36px 36px 128px" },
}));
export const PageContent = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  width: "100%",
});
export const ContentContainer = styled(Box)({
  maxWidth: 1600,
  width: "100%",
  margin: "0 auto",
  minWidth: 0,
});
