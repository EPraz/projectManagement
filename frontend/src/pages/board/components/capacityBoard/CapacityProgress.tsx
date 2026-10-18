import { Box, LinearProgress, Typography } from "@mui/material";
import type { TeamMemberCapacity } from "../../../../types";
import { computeProgress } from "./CapacityBoard.helpers";
export default function CapacityProgress({
  member,
}: {
  member: TeamMemberCapacity;
}) {
  return (
    <Box sx={{ minWidth: 140 }}>
      <LinearProgress
        aria-label={`Capacity progress for ${member.user?.name ?? "member"}`}
        variant="determinate"
        value={computeProgress(member)}
        sx={{ height: 6, mb: 1 }}
      />
      <Typography variant="body2" color="text.secondary">
        {member.remainingWork}h remaining
      </Typography>
    </Box>
  );
}
