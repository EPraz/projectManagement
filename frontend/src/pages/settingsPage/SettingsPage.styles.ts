import { Box, Card, ListItemButton, styled } from "@mui/material";

export const Container = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    gap: theme.spacing(3)
  }
}));

export const Sidebar = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    width: 280,
    marginBottom: 0,
    height: "fit-content"
  }
}));

export const Content = styled(Card)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3)
}));

export const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  "&:last-child": {
    marginBottom: 0
  }
}));

export const StyledListItem = styled(ListItemButton)<{ active?: boolean }>(
  ({ theme, active }) => ({
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(0.5),
    "&:hover": {
      backgroundColor: theme.palette.action.hover
    },
    ...(active && {
      backgroundColor: theme.palette.primary.main + "14",
      color: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.main + "1F"
      },
      "& .MuiListItemIcon-root": {
        color: theme.palette.primary.main
      }
    })
  })
);
