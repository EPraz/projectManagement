import { Box, Card, IconButton, styled } from "@mui/material";
export const ProjectsContainer = styled(Box)(({ theme }) => ({
  minHeight: "100dvh",
  width: "100%",
  minWidth: 0,
  padding: theme.spacing(2),
  [theme.breakpoints.up("md")]: { padding: "22px 36px 40px 128px" },
}));
export const Header = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 28,
  marginBottom: 24,
});
export const SearchBar = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 8,
  width: "100%",
  flexWrap: "wrap",
});
export const ProjectGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(0,1fr)",
  gap: 24,
  [theme.breakpoints.up("lg")]: {
    gridTemplateColumns: "repeat(2,minmax(0,1fr))",
  },
}));
export const ProjectList = styled(Box)({ display: "grid", gap: 16 });
export const ProjectCard = styled(Card)(({ theme }) => ({
  position: "relative",
  minWidth: 0,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 24,
    right: 24,
    height: 3,
    backgroundColor: theme.palette.primary.main,
  },
  "&:focus-within": { borderColor: theme.palette.primary.main },
}));
export const FavoriteButton = styled(IconButton)({
  position: "absolute",
  top: 12,
  right: 12,
  zIndex: 1,
});
export const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(4, 2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: 12,
  border: `1px dashed ${theme.palette.divider}`,
  marginTop: 24,
}));
