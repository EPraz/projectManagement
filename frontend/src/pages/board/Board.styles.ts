import { Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

export const ActionContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1, 2),
  width: "fit-content",
  position: "relative",
  zIndex: 1,
}));

export const AddButton = styled(IconButton)(({ theme }) => ({
  "&.MuiIconButton-root": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(1),
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(0.5, 2),
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.paper,
    fontSize: "0.875rem",
    fontWeight: 500,
    minWidth: "155px",
    height: 36,
    textTransform: "none",

    "&:hover": {
      backgroundColor: theme.palette.primary.main + "0A",
      borderColor: theme.palette.primary.dark,
    },

    "&:active": {
      backgroundColor: theme.palette.primary.main + "14",
    },

    "&.Mui-disabled": {
      borderColor: theme.palette.action.disabled,
      color: theme.palette.action.disabled,
      backgroundColor: theme.palette.action.disabledBackground,
    },

    "& .MuiSvgIcon-root": {
      fontSize: "1.25rem",
    },
  },
}));

export const AddButtonWrapper = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
}));

export const BoardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

export const BoardHeader = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const TabsWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1, 2),
  gap: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
}));

export const TabButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ theme, active }) => ({
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  fontSize: "0.875rem",
  fontWeight: 500,
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  backgroundColor: active ? theme.palette.primary.main + "0A" : "transparent",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  transition: theme.transitions.create(["background-color", "color"]),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    color: active ? theme.palette.primary.main : theme.palette.text.primary,
  },
}));

export const ActionContainerStyled = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export const AddButtonStyled = styled(IconButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5, 1.5),
  color: theme.palette.primary.main,
  gap: theme.spacing(1),
  "&:hover": {
    backgroundColor: theme.palette.primary.main + "0A",
  },
  "&.Mui-disabled": {
    borderColor: theme.palette.action.disabled,
    color: theme.palette.action.disabled,
  },
}));
