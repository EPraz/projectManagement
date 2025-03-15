import { DragIndicator } from "@mui/icons-material";
import { Box, Card, styled } from "@mui/material";

export const Container = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
}));

export const Header = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}));

export const SearchBar = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",
  },
}));

export const Content = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  flex: 1,
  overflowY: "auto",
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

export const EpicCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    transform: "translateY(-1px)",
    boxShadow: theme.shadows[2],
  },
}));

export const FeatureCard = styled(Card)(({ theme }) => ({
  marginLeft: theme.spacing(7),
  marginBottom: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    transform: "translateX(4px)",
    boxShadow: theme.shadows[1],
  },
}));

export const ItemHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  gap: theme.spacing(1),
}));

export const DragHandle = styled(DragIndicator)(({ theme }) => ({
  color: theme.palette.text.disabled,
  cursor: "grab",
  "&:hover": {
    color: theme.palette.text.secondary,
  },
}));

export const ItemContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexWrap: "wrap",
  },
}));
