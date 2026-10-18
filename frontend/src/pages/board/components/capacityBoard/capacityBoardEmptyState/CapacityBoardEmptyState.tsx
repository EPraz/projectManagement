import { Alert, Box, Typography } from "@mui/material";
import type { Sprint } from "../../../../../types";
export default function CapacityBoardEmptyState({
  sprint,
}: {
  sprint: Sprint | null;
  handleOpenAddDialog?: () => void;
}) {
  return (
    <Alert severity="info">
      <Box>
        <Typography component="h3" sx={{ fontSize: 18, fontWeight: 600 }}>
          {sprint
            ? "No capacity planned yet"
            : "Select a sprint to plan capacity"}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          Allocate capacity to existing project members to track their workload
          for this sprint.
        </Typography>
      </Box>
    </Alert>
  );
}
