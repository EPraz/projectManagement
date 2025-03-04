import { Avatar, Box, Divider, Grid2 as Grid, Typography } from "@mui/material";
import { Sprint } from "../../types";
import { TaskCard } from "./DashBoard.styles";

import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";

const SprintGoalsAndMilestones = ({ sprint }: { sprint?: Sprint | null }) => {
  // This would typically come from your data model
  // For now, we'll use dummy data
  const goals = [
    { id: 1, title: "Complete user authentication flow", completed: true },
    { id: 2, title: "Implement dashboard analytics", completed: false },
    { id: 3, title: "Finalize payment integration", completed: false },
    { id: 4, title: "Deploy beta version to staging", completed: false },
  ];

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Sprint Goal
          </Typography>
          <Typography variant="body1">
            {sprint?.name || "Complete core functionality for MVP release"}
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Key Milestones
        </Typography>
      </Grid>

      {goals.map((goal, index) => (
        <Grid size={{ xs: 12, md: 6 }} key={`${goal.id}_${index}`}>
          <TaskCard>
            <Avatar
              sx={{ bgcolor: goal.completed ? "success.main" : "info.main" }}
            >
              {goal.completed ? (
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
                {goal.completed ? "Completed" : "In progress"}
              </Typography>
            </Box>
          </TaskCard>
        </Grid>
      ))}
    </Grid>
  );
};
export default SprintGoalsAndMilestones;
