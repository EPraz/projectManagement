import { Box, Typography } from "@mui/material";
export default function ProgressRing({
  value,
  label,
  size = 80,
}: {
  value: number;
  label: string;
  size?: number;
}) {
  return (
    <Box
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      sx={{
        width: size,
        height: size,
        position: "relative",
        flexShrink: 0,
        color: "primary.main",
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          opacity=".18"
        />
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${value * 2.765} 276.5`}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <Typography
        component="span"
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 23,
          fontWeight: 500,
          color: "text.primary",
        }}
      >
        {value}
        <Typography component="span" sx={{ fontSize: 12 }}>
          %
        </Typography>
      </Typography>
    </Box>
  );
}
