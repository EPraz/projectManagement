import { Box, Tab, Tabs, Typography } from "@mui/material";
import styled from "styled-components";

export const HeaderContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}));

export const TopBar = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1.5, 2),
}));

export const ProjectTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: 600,
  color: theme.palette.text.primary,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 40,
  "& .MuiTabs-indicator": {
    backgroundColor: theme.palette.primary.main,
    height: 2,
  },
  "& .MuiTabs-flexContainer": {
    padding: `0 ${theme.spacing(2)}`,
  },
  "& .MuiTabs-scrollButtons": {
    width: 28,
    "&.Mui-disabled": { opacity: 0.3 },
  },
}));

export const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 40,
  padding: theme.spacing(0, 1.5),
  textTransform: "none",
  fontSize: "0.875rem",
  fontWeight: 400,
  color: theme.palette.text.secondary,
  "&.Mui-selected": {
    color: theme.palette.text.primary,
    fontWeight: 500,
  },
  "&:hover": {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.action.hover,
  },
  minWidth: "auto",
}));

export const TabsBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 1,
}));
