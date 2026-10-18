import {
  CircularProgress,
  LinearProgress,
  Box,
  Typography,
} from "@mui/material";
import StudioMark from "../studio/StudioMark";
import type { LoadingProps } from "../../types";

export default function Loading({
  message = "Loading workspace…",
  description = "Preparing your view. Please wait a moment.",
  variant = "default",
}: LoadingProps) {
  if (variant === "minimal") {
    return (
      <Box role="status" display="flex" alignItems="center" gap={2} p={2}>
        <CircularProgress size={24} aria-label={message} />
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Box>
    );
  }
  return (
    <Box
      role="status"
      aria-live="polite"
      aria-busy="true"
      sx={{
        minHeight: variant === "fullscreen" ? "100dvh" : "60dvh",
        display: "grid",
        placeItems: "center",
        p: { xs: 3, sm: 4 },
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 360 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box sx={{ display: "flex", color: "primary.main" }}>
            <StudioMark />
          </Box>
          <Typography variant="body2" fontWeight={500}>
            EPProject Management
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: 22,
            lineHeight: 1.3,
            fontWeight: 600,
            overflowWrap: "anywhere",
          }}
        >
          {message}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, mb: 3 }}
        >
          {description}
        </Typography>
        <LinearProgress
          aria-label={message}
          sx={{
            height: 3,
            borderRadius: 1,
            "@media (prefers-reduced-motion: reduce)": {
              "& .MuiLinearProgress-bar": {
                animation: "none",
                transform: "none",
                width: "40%",
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}
