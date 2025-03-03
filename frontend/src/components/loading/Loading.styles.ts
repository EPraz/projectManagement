import { Box } from "@mui/material";
import styled, { keyframes } from "styled-components";

export const pulse = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.5;
  }
`;

export const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  gap: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
}));

export const LoadingIcon = styled(Box)(({ theme }) => ({
  position: "relative",
  width: 100,
  height: 100,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& .outer-circle": {
    position: "absolute",
    width: "100%",
    height: "100%",
    border: `3px solid ${theme.palette.primary.main}`,
    borderRadius: "50%",
    // animation: `${pulse} 2s ease-in-out infinite`,
  },
  "& .inner-circle": {
    position: "absolute",
    width: "70%",
    height: "70%",
    border: `3px solid ${theme.palette.secondary.main}`,
    borderRadius: "50%",
    // animation: `${pulse} 2s ease-in-out infinite`,
    animationDelay: "0.3s",
  },
  "& .spinner": {
    // animation: `${rotate} 2s linear infinite`,
    color: theme.palette.primary.main,
  },
}));

export const MessageContainer = styled(Box)(({ theme }) => ({
  textAlign: "center",
  "& .primary-text": {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  "& .secondary-text": {
    color: theme.palette.text.secondary,
    fontSize: "0.875rem",
  },
}));

export const ProgressDots = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  "& .dot": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
    opacity: 0.3,
  },
  // "& .dot:nth-of-type(1)": {
  //   animation: `${pulse} 1s ease-in-out infinite`,
  // },
  // "& .dot:nth-of-type(2)": {
  //   animation: `${pulse} 1s ease-in-out infinite`,
  //   animationDelay: "0.2s",
  // },
  // "& .dot:nth-of-type(3)": {
  //   animation: `${pulse} 1s ease-in-out infinite`,
  //   animationDelay: "0.4s",
  // },
}));
