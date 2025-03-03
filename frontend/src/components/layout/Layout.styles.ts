import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const LayoutWrapper = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "99vh",
  width: "100%",
  backgroundColor: "#f5f5f5",
});

export const LayoutRoot = styled("div")({
  display: "flex",
  width: "100%",
  position: "relative",
  minHeight: "99vh",
  overflow: "hidden",
  margin: "auto",
});

export const MainContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== "sidebarOpen",
})<{ sidebarOpen: boolean }>(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  overflow: "hidden",
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  padding: "16px 16px 16px 0",
}));

export const PageContent = styled(Box)(() => ({
  flex: 1,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  width: "100%",
}));

export const ContentContainer = styled(Box)(() => ({
  maxWidth: "1440px",
  margin: "0 auto",
  width: "100%",
  height: "100%",
}));
