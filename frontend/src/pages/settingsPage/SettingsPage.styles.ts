import { Box, Card, ListItem } from "@mui/material";
import styled from "styled-components";

export const Container = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    gap: theme.spacing(3),
  },
}));

export const Sidebar = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    width: 280,
    marginBottom: 0,
    height: "fit-content",
  },
}));

export const Content = styled(Card)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
}));

export const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  "&:last-child": {
    marginBottom: 0,
  },
}));

export const AvatarContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "fit-content",
  "&:hover .avatar-overlay": {
    opacity: 1,
  },
}));

export const AvatarOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0,
  transition: "opacity 0.2s ease-in-out",
}));

export const StyledListItem = styled(ListItem)<{ active?: boolean }>(
  ({ theme, active }) => ({
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(0.5),
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    ...(active && {
      backgroundColor: theme.palette.primary.main + "14",
      color: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.main + "1F",
      },
      "& .MuiListItemIcon-root": {
        color: theme.palette.primary.main,
      },
    }),
  })
);
