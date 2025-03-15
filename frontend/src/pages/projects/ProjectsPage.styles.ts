import { Box, Card, IconButton, styled } from "@mui/material";
import { motion } from "framer-motion";

// Create a motion Card component
// const MotionCard = motion(Card);
const MotionCard = motion.create(Card);

// Container for the entire projects page
export const ProjectsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  minHeight: "100vh",
  width: "100vw",
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(6),
  },
}));

export const Header = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(4),
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

export const HeaderContent = styled(Box)(({ theme }) => ({
  "& h1": {
    fontSize: "2rem",
    fontWeight: 600,
    color: theme.palette.primary.main, // Primary color (60%)
    marginBottom: theme.spacing(1),
  },
  "& p": {
    color: theme.palette.text.secondary,
    fontSize: "1.1rem",
  },
}));

export const SearchBar = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  width: "100%",
  flexWrap: "wrap",
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  [theme.breakpoints.up("md")]: {
    width: "auto",
    minWidth: "320px",
  },
}));

export const ProjectGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(4),
  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
  marginTop: theme.spacing(4),
}));

export const ProjectList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  marginTop: theme.spacing(4),
}));

export const ProjectCard = styled(MotionCard)(({ theme }) => ({
  position: "relative",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease-in-out",
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
    borderColor: theme.palette.secondary.main, // Secondary color (30%)
  },
}));

export const ProjectCardHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "& .title": {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
  },
  "& .description": {
    color: theme.palette.text.secondary,
    fontSize: "0.875rem",
  },
}));

export const FavoriteButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "isListView",
})<{ isListView?: boolean }>(({ theme, isListView }) => ({
  ...(isListView
    ? {
        position: "relative",
        top: "auto",
        right: "auto",
        marginRight: theme.spacing(2),
      }
    : {
        position: "absolute",
        top: theme.spacing(2),
        right: theme.spacing(2),
      }),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  zIndex: 1,
  color: theme.palette.warning.main, // Accent color (10%)
  "&:hover": {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.warning.dark,
  },
}));

export const ProjectListItem = styled(MotionCard)(({ theme }) => ({
  position: "relative",
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  transition: "all 0.3s ease-in-out",
  overflow: "hidden",
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.secondary.main,
  },
}));

export const ProjectStats = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  "& > div": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
}));

export const MetricBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  border: `1px solid ${theme.palette.divider}`,
  "& .icon": {
    color: theme.palette.secondary.main,
  },
  "& .value": {
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  "& .label": {
    color: theme.palette.text.secondary,
    fontSize: "0.875rem",
  },
}));

export const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(8),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  border: `2px dashed ${theme.palette.divider}`,
  margin: "0 auto",
  maxWidth: "600px",
  "& h3": {
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  "& p": {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(4),
  },
}));

export const ActionButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  marginLeft: "auto",
  "& .MuiButton-root": {
    borderRadius: theme.shape.borderRadius * 1.5,
  },
}));
