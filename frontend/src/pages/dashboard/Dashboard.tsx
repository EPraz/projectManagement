import { Box, Typography, Grid2 as Grid, Avatar, Divider } from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  InsertDriveFile as InsertDriveFileIcon,
  FiberManualRecord as FiberManualRecordIcon,
} from "@mui/icons-material";
import {
  ActivityCard,
  ActivityItem,
  DashboardContainer,
  InfoGrid,
  InfoLabel,
  InfoValue,
  ProgressContainer,
  SectionTitle,
  StatCard,
  StatIcon,
  StyledCard,
  StyledLinearProgress,
  TaskCard,
} from "./DashBoard.styles";

const Dashboard = () => {
  return (
    <DashboardContainer>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <StyledCard>
            <Box sx={{ p: 3 }}>
              <SectionTitle>Project Info</SectionTitle>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The goal is to develop a convenient, intuitive, and attractive
                website for an insurance company that will meet the customers'
                needs for information about insurance services and processes.
              </Typography>

              <InfoGrid>
                <InfoLabel>Project type</InfoLabel>
                <InfoValue>Promo website</InfoValue>

                <InfoLabel>Start date</InfoLabel>
                <InfoValue>Aug 1, 2023</InfoValue>

                <InfoLabel>End date</InfoLabel>
                <InfoValue>Aug 30, 2023</InfoValue>

                <InfoLabel>Team members</InfoLabel>
                <InfoValue>5</InfoValue>

                <InfoLabel>Reports</InfoLabel>
                <InfoValue>3</InfoValue>
              </InfoGrid>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "primary.main",
                    fontSize: "1.25rem",
                  }}
                >
                  NA
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Project Leader
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nader Ahmed
                  </Typography>
                </Box>
              </Box>

              <ProgressContainer>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2">Overall Progress</Typography>
                  <Typography variant="subtitle2" color="primary">
                    70%
                  </Typography>
                </Box>
                <StyledLinearProgress variant="determinate" value={70} />
              </ProgressContainer>
            </Box>
          </StyledCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <StatCard>
                <StatIcon>
                  <AccessTimeIcon />
                </StatIcon>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    4d
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Time remaining
                  </Typography>
                </Box>
              </StatCard>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <StatCard>
                <StatIcon>
                  <InsertDriveFileIcon />
                </StatIcon>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    28
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created tasks
                  </Typography>
                </Box>
              </StatCard>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <StatCard>
                <StatIcon>
                  <FiberManualRecordIcon />
                </StatIcon>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    10
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tasks in progress
                  </Typography>
                </Box>
              </StatCard>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <StatCard>
                <StatIcon
                  sx={{ bgcolor: "warning.light", color: "warning.main" }}
                >
                  <FiberManualRecordIcon />
                </StatIcon>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    7
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upcoming tasks
                  </Typography>
                </Box>
              </StatCard>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <ActivityCard>
                <SectionTitle>Recent Activity</SectionTitle>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {[
                    {
                      avatar: "F",
                      name: "Floyd Miles",
                      action: "joined the project",
                      time: "1 day ago",
                    },
                    {
                      avatar: "J",
                      name: "Jenny Wilson",
                      action: "joined the project",
                      time: "1 day ago",
                    },
                    {
                      avatar: "A",
                      name: "Arlene McCoy",
                      action: "assigned a new task to You",
                      time: "1 day ago",
                    },
                    {
                      avatar: "R",
                      name: "Ronald Richards",
                      action: "reported an issue",
                      time: "2 days ago",
                    },
                  ].map((activity, index) => (
                    <ActivityItem key={index}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: `primary.${index % 2 ? "light" : "main"}`,
                        }}
                      >
                        {activity.avatar}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2">
                          <strong>{activity.name}</strong> {activity.action}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </Box>
                    </ActivityItem>
                  ))}
                </Box>
              </ActivityCard>
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <StyledCard>
            <Box sx={{ p: 3 }}>
              <SectionTitle>Project Tasks</SectionTitle>
              <Grid container spacing={3}>
                {[
                  {
                    avatar: "UX",
                    color: "error",
                    title: "UX Research",
                    description: "UX audit, personas, user flow, user stories",
                  },
                  {
                    avatar: "D",
                    color: "primary",
                    title: "Design",
                    description: "Home page, Services page, About Us",
                  },
                  {
                    avatar: "DS",
                    color: "success",
                    title: "Design System",
                    description: "UI kit, components",
                  },
                  {
                    avatar: "D",
                    color: "warning",
                    title: "Development",
                    description: "Frontend implementation",
                  },
                ].map((task, index) => (
                  <Grid size={{ xs: 12, md: 6 }} key={index}>
                    <TaskCard>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: `${task.color}.main`,
                        }}
                      >
                        {task.avatar}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {task.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {task.description}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="caption" color="text.secondary">
                          Deadline
                        </Typography>
                        <Typography variant="body2">Aug 22, 2023</Typography>
                      </Box>
                    </TaskCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </StyledCard>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
};

export default Dashboard;
