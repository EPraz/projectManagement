import { Avatar, Box, Divider, Grid2 as Grid, Typography } from "@mui/material";
import { Sprint } from "../../../../types";
import { TaskCard } from "../../DashBoard.styles";

import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import { SprintGoalStatus } from "../../../../constants";
import { formatStatusName } from "../../../../helpers";

const SprintGoalsAndMilestones = ({ sprint }: { sprint?: Sprint | null }) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Sprint Goal
          </Typography>
          <Typography variant="body1">
            {sprint?.name || "Sprint name not defined"}
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Key Milestones
        </Typography>
      </Grid>

      {sprint?.sprintGoal.map((goal, index) => (
        <Grid size={{ xs: 12, md: 6 }} key={`${goal.id}_${index}`}>
          <TaskCard>
            <Avatar
              sx={{
                bgcolor:
                  goal.goalsStatus == SprintGoalStatus.COMPLETED
                    ? "success.main"
                    : goal.goalsStatus == SprintGoalStatus.IN_PROGRESS
                    ? "info.main"
                    : "error.main",
              }}
            >
              {goal.goalsStatus == SprintGoalStatus.COMPLETED ? (
                <TaskAltIcon width={20} height={20} />
              ) : (
                <CrisisAlertIcon width={20} height={20} />
              )}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {goal.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatStatusName(goal.goalsStatus).toLowerCase()}
              </Typography>
            </Box>
          </TaskCard>
        </Grid>
      ))}
    </Grid>
  );
};
export default SprintGoalsAndMilestones;
