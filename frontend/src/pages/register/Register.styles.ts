import { Box, styled } from "@mui/material";

export const LeftSection = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(6),
  backgroundColor: "white",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(4),
  },
}));

export const RightSection = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(6),
  background: "linear-gradient(135deg, #8e2de2, #4a00e0)",
  color: "white",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",

  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
    transform: "skewX(-15deg)",
  },

  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(4),
  },
}));

export const StepperContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  "& .MuiStepLabel-root": {
    color: theme.palette.text.secondary,
  },
  "& .MuiStepIcon-root": {
    color: theme.palette.grey[300],
    "&.Mui-active, &.Mui-completed": {
      color: theme.palette.primary.main,
    },
  },
}));
