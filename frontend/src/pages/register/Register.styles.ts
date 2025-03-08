import { Box, Card, styled, keyframes } from "@mui/material";

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const diagonalAnimation = keyframes`
  0% {
    transform: translateX(-100%) rotate(-45deg);
  }
  100% {
    transform: translateX(100%) rotate(-45deg);
  }
`;

export const AuthWrapper = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  background: `linear-gradient(-45deg, ${theme.palette.primary.main}, #9c27b0, #2196f3)`,
  backgroundSize: "400% 400%",
  animation: `${gradientAnimation} 15s ease infinite`,
  position: "relative",
  overflow: "hidden",

  "&::before": {
    content: '""',
    position: "absolute",
    width: "200%",
    height: "100px",
    background: "rgba(255, 255, 255, 0.1)",
    animation: `${diagonalAnimation} 15s linear infinite`,
  },
}));

export const AuthCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 900,
  display: "flex",
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: "0 8px 40px rgba(0, 0, 0, 0.12)",
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column-reverse", // Reverse order on mobile
  },
}));

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

export const LogoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(4),
}));

export const Logo = styled("img")({
  height: 40,
});

export const Form = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
}));

export const WelcomeText = styled(Box)(({ theme }) => ({
  "& h1": {
    fontSize: "2.5rem",
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    background: "linear-gradient(45deg, #fff, #f0f0f0)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  "& p": {
    fontSize: "1.1rem",
    opacity: 0.9,
    lineHeight: 1.6,
  },
}));

export const DiagonalShapes = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: "60%",
  overflow: "hidden",
  zIndex: 0,
  opacity: 0.4,

  "&::before, &::after": {
    content: '""',
    position: "absolute",
    width: "200%",
    height: "100%",
    background:
      "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
    animation: `${diagonalAnimation} 20s linear infinite`,
  },

  "&::after": {
    animationDelay: "-10s",
    opacity: 0.5,
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
