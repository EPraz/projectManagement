import { Box } from "@mui/material";
import styled, { keyframes } from "styled-components";

// Define keyframes
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

// Fixed styled components
export const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: ${({ theme }) => theme.spacing(3)};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.palette.background.paper} 0%,
    ${({ theme }) => theme.palette.background.default} 100%
  );
`;

export const LoadingIcon = styled(Box)`
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  .outer-circle {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid ${({ theme }) => theme.palette.primary.main};
    border-radius: 50%;
    animation: ${pulse} 2s ease-in-out infinite;
  }

  .inner-circle {
    position: absolute;
    width: 70%;
    height: 70%;
    border: 3px solid ${({ theme }) => theme.palette.secondary.main};
    border-radius: 50%;
    animation: ${pulse} 2s ease-in-out infinite;
    animation-delay: 0.3s;
  }

  .spinner {
    animation: ${rotate} 2s linear infinite;
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;

export const MessageContainer = styled(Box)`
  text-align: center;

  .primary-text {
    font-weight: 600;
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    color: ${({ theme }) => theme.palette.text.primary};
  }

  .secondary-text {
    color: ${({ theme }) => theme.palette.text.secondary};
    font-size: 0.875rem;
  }
`;

export const ProgressDots = styled(Box)`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.palette.primary.main};
    opacity: 0.3;
  }

  .dot:nth-of-type(1) {
    animation: ${pulse} 1s ease-in-out infinite;
  }

  .dot:nth-of-type(2) {
    animation: ${pulse} 1s ease-in-out infinite;
    animation-delay: 0.2s;
  }

  .dot:nth-of-type(3) {
    animation: ${pulse} 1s ease-in-out infinite;
    animation-delay: 0.4s;
  }
`;
