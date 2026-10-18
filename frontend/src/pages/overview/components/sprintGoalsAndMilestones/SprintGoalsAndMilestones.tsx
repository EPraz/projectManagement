import { Box, Chip, LinearProgress, Typography } from "@mui/material";
import type { Sprint } from "../../../../types";
import { formatStatusName } from "../../../../helpers";
import OverviewPanel from "../OverviewPanel";
export default function SprintGoalsAndMilestones({
  sprint,
}: {
  sprint?: Sprint | null;
}) {
  return (
    <OverviewPanel title="Sprint goals & milestones">
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Sprint: {sprint?.name || "None selected"}
      </Typography>
      {!sprint?.sprintGoal.length && (
        <Typography variant="body2" color="text.secondary">
          No goals in this sprint yet.
        </Typography>
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0,1fr)",
            md: "repeat(2,minmax(0,1fr))",
          },
          gap: 3,
        }}
      >
        {sprint?.sprintGoal.map((goal) => (
          <Box
            key={goal.id}
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "8px",
              minWidth: 0,
            }}
          >
            <Typography fontWeight={500} sx={{ overflowWrap: "anywhere" }}>
              {goal.title}
            </Typography>
            <Chip
              size="small"
              label={formatStatusName(goal.goalsStatus)}
              variant="outlined"
              sx={{ my: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {goal.description}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
              <LinearProgress
                aria-label={`${goal.title} progress`}
                variant="determinate"
                value={goal.progress ?? 0}
                sx={{ flex: 1 }}
              />
              <Typography variant="caption">{goal.progress ?? 0}%</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {goal.goalTask?.filter((task) => task.completed).length ?? 0} /{" "}
              {goal.goalTask?.length ?? 0} checklist items complete
            </Typography>
          </Box>
        ))}
      </Box>
    </OverviewPanel>
  );
}
