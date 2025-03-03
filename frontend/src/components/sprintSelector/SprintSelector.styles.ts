import {
  Autocomplete,
  Box,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import GroupWorkOutlinedIcon from "@mui/icons-material/GroupWorkOutlined";

export const SelectorContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  height: 36,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(0, 0.5),
  transition: theme.transitions.create(["box-shadow", "border-color"]),
  "&:hover": {
    borderColor: theme.palette.primary.main,
  },
}));

export const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  width: 200,
  "& .MuiOutlinedInput-root": {
    height: 32,
    fontSize: "0.875rem",
    backgroundColor: "transparent",
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
    "& .MuiOutlinedInput-input": {
      padding: theme.spacing(0, 1),
    },
  },
  "& .MuiAutocomplete-endAdornment": {
    display: "none",
  },
}));

export const SprintIcon = styled(GroupWorkOutlinedIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: 20,
  marginLeft: theme.spacing(0.5),
}));

export const SprintMenuItem = styled(MenuItem)(({ theme }) => ({
  "&.MuiMenuItem-root": {
    fontSize: "0.875rem",
    padding: theme.spacing(0.75, 1.5),
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing(2), // Ajustado para mejor espaciado
    width: "100%",
    position: "relative", // Importante para el posicionamiento del botón

    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },

    "&.new-sprint": {
      borderTop: `1px solid ${theme.palette.divider}`,
      marginTop: theme.spacing(0.5),
      paddingTop: theme.spacing(1),
      color: theme.palette.primary.main,
    },

    // Asegurarse de que el texto y el botón estén bien espaciados
    "& .MuiTypography-root": {
      flex: "1 1 auto",
      marginRight: theme.spacing(2),
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
}));

export const DeleteButton = styled(IconButton)(({ theme }) => ({
  "&.MuiIconButton-root": {
    padding: 4,
    marginLeft: "auto", // Empuja el botón al extremo derecho
    minWidth: 24, // Asegura un ancho mínimo
    height: 24,

    "&:hover": {
      backgroundColor: theme.palette.error.main + "14",
    },

    "& .MuiSvgIcon-root": {
      fontSize: 16,
    },
  },
}));

// Contenedor para el nombre del sprint
export const SprintNameContainer = styled("div")({
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

// Estilo para el TextField dentro del Autocomplete
export const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    padding: 0,
  },
  "& .MuiInputBase-input": {
    padding: theme.spacing(0.5, 1),
  },
}));
