import { styled } from "@mui/material/styles";

interface StatusIndicatorProps {
  status: string;
  color: string;
}

export const StatusIndicator = styled("span")<StatusIndicatorProps>(
  ({ color }) => ({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    display: "inline-block",
    marginRight: "8px",
    backgroundColor: color,
  })
);
