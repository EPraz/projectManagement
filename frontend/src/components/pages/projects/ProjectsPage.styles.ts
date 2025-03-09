import { Box, Card, IconButton, styled } from "@mui/material";
import { motion } from "framer-motion";

// Crear un componente de Card con motion
const MotionCard = motion(Card);

export const Header = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

export const SearchBar = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  width: "100%",
  flexWrap: "wrap",
  [theme.breakpoints.up("md")]: {
    width: "auto",
  },
}));

export const ProjectGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(3),
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
}));

// Vista de lista para proyectos
export const ProjectList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

// Usar el componente MotionCard con styled de MUI
export const ProjectCard = styled(MotionCard)(({ theme }) => ({
  position: "relative",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease-in-out",
  overflow: "hidden", // Prevenir desbordamiento
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
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
        top: theme.spacing(1),
        right: theme.spacing(1),
      }),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  zIndex: 1,
  "&:hover": {
    backgroundColor: theme.palette.background.paper,
  },
}));

// Actualizar ProjectListItem para mejor alineación
export const ProjectListItem = styled(MotionCard)(({ theme }) => ({
  position: "relative",
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center", // Añadido para centrar contenido verticalmente
  transition: "all 0.3s ease-in-out",
  overflow: "hidden",
  padding: theme.spacing(2), // Añadido padding consistente
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

export const ProjectStats = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  "& > div": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
  },
}));

export const MetricBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  "& .icon": {
    color: theme.palette.primary.main,
  },
}));

export const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(8),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `2px dashed ${theme.palette.divider}`,
  margin: "0 auto",
  maxWidth: "600px",
}));
