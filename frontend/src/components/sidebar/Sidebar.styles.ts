import {
  Box,
  Drawer,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import type { StyledDrawerProps } from "../../types";

export const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "$IsOpen",
})<StyledDrawerProps>(({ $IsOpen, theme }) => ({
  "& .MuiDrawer-paper": {
    width: $IsOpen ? "80px" : "250px",
    margin: "16px",
    borderRadius: "16px",
    backgroundColor: theme.palette.sidebar.background,
    color: theme.palette.sidebar.text,
    boxSizing: "border-box",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    height: "calc(100vh - 32px)",
    maxHeight: "calc(100vh - 32px)",
    transition: "width 0.3s ease",
    overflowX: "hidden",
    overflowY: "auto",
    position: "fixed",
    zIndex: 1200,
    "&::-webkit-scrollbar": {
      width: "4px",
    },
    "&::-webkit-scrollbar-track": {
      background: "rgba(0, 0, 0, 0.1)",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "rgba(255, 255, 255, 0.2)",
      borderRadius: "4px",
    },
  },
  "& .MuiBackdrop-root": {
    display: "none",
  },
}));

// Create a placeholder div to maintain layout when the drawer is fixed
export const SidebarPlaceholder = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$IsOpen",
})<StyledDrawerProps>(({ $IsOpen }) => ({
  width: $IsOpen ? "112px" : "282px", // 80px/250px + 32px margin
  minWidth: $IsOpen ? "112px" : "282px",
  transition: "width 0.3s ease, min-width 0.3s ease",
  flexShrink: 0,
}));

export const SidebarContent = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

export const Logo = styled("div")({
  display: "flex",
  alignItems: "center",
  padding: "16px",
  marginBottom: "8px",
  position: "relative",
});

export const LogoText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "$IsOpen",
})<StyledDrawerProps>(({ $IsOpen }) => ({
  fontWeight: "bold",
  marginLeft: "8px",
  fontSize: "18px",
  opacity: $IsOpen ? 0 : 1,
  transition: "opacity 0.2s ease",
  whiteSpace: "nowrap",
}));

export const StyledListItemButton = styled(ListItemButton)({
  margin: "4px 8px",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  "&.active": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
});

export const StyledListItemIcon = styled(ListItemIcon)({
  minWidth: "40px",
  color: "#9e9e9e",
});

export const StyledListItemText = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== "$IsOpen",
})<StyledDrawerProps>(({ $IsOpen }) => ({
  "& .MuiListItemText-primary": {
    fontSize: "14px",
    opacity: $IsOpen ? 0 : 1,
    transition: "opacity 0.2s ease",
    whiteSpace: "nowrap",
  },
}));

export const UserSection = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$IsOpen",
})<StyledDrawerProps>(({ $IsOpen }) => ({
  marginTop: "auto",
  display: "flex",
  flexDirection: $IsOpen ? "column" : "row",
  alignItems: "center",
  backgroundColor: "#0a1414",
  justifyContent: "space-between",
  transition: "flex-direction 0.3s",
}));

export const UserBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$IsOpen",
})<StyledDrawerProps>(({ $IsOpen }) => ({
  padding: $IsOpen ? "16px 8px" : "16px",
  display: "flex",
  alignItems: "center",
  backgroundColor: "#0a1414",
}));

export const UserInfo = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$IsOpen",
})<StyledDrawerProps>(({ $IsOpen }) => ({
  marginLeft: "12px",
  opacity: $IsOpen ? 0 : 1,
  transition: "opacity 0.2s ease",
  whiteSpace: "nowrap",
  display: $IsOpen ? "none" : "block",
}));

export const UserName = styled(Typography)({
  fontSize: "14px",
  fontWeight: 500,
});

export const WorkspaceText = styled(Typography)({
  fontSize: "12px",
  color: "#9e9e9e",
});

export const ThemeToggle = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "16px",
  right: "16px",
  width: "32px",
  height: "32px",
  color: theme.palette.sidebar.text,
  "&:hover": {
    backgroundColor: theme.palette.sidebar.hover,
  },
}));

export const CollapseButton = styled(IconButton)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: theme.palette.sidebar.text,
  "&:hover": {
    backgroundColor: theme.palette.sidebar.hover,
  },
}));
