import { Box, Typography, Grid2 as Grid, Divider } from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  InsertDriveFile as InsertDriveFileIcon,
  FiberManualRecord as FiberManualRecordIcon,
} from "@mui/icons-material";
import {
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
} from "./DashBoard.styles";
import { useOutletContext } from "react-router-dom";
import { LayoutContextProps } from "../../types";
import { format } from "date-fns";
import { SprintSelector } from "../../components";
import { getDaysRemaining } from "./DashBoard.helpers";
import SprintMetricsChart from "./SprintMetricsChart";
import RecentActivityFeed from "./RecentActivity";
import UpcomingDeadlines from "./UpcomingDeadlines";
import TeamWorkload from "./TeamWorkload";
import BlockersAndImpediments from "./BlockersAndImpediments";
import SprintGoalsAndMilestones from "./SprintGoalsAndMilestones";

const Dashboard = () => {
  const { project, sprint } = useOutletContext<LayoutContextProps>();

  return (
    <DashboardContainer>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <StyledCard>
            <Box sx={{ p: 3 }}>
              <SectionTitle>{project?.title}</SectionTitle>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {project?.description}
              </Typography>

              <InfoGrid>
                <InfoLabel>Project type</InfoLabel>
                <InfoValue>{project?.type}</InfoValue>

                <InfoLabel>Start date</InfoLabel>
                <InfoValue>
                  {project?.createdAt
                    ? format(new Date(project.createdAt), "MMMM d, yyyy")
                    : ""}
                </InfoValue>

                <InfoLabel>End date</InfoLabel>
                <InfoValue>
                  {project?.endDate || <em>Not estimated yet</em>}
                </InfoValue>

                <InfoLabel>Team members</InfoLabel>
                <InfoValue>{project?.users.length}</InfoValue>
                {/* 
                <InfoLabel>Reports</InfoLabel>
                <InfoValue>3</InfoValue> */}
              </InfoGrid>

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
                    10%
                  </Typography>
                </Box>
                <StyledLinearProgress variant="determinate" value={10} />
              </ProgressContainer>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <SprintMetricsChart sprint={sprint} />
              </Box>
            </Box>
          </StyledCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={3}>
            <Grid
              display={"flex"}
              size={{ xs: 12 }}
              justifyContent={"space-evenly"}
              alignItems={"center"}
            >
              Sprint
              <SprintSelector />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <StatCard>
                <StatIcon>
                  <AccessTimeIcon />
                </StatIcon>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {getDaysRemaining(sprint?.endDate)}
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
                    {sprint?.tickets?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tickets
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
                    {sprint?.tickets
                      ?.slice()
                      ?.filter((x) => x.status.name == "IN_PROGRESS").length ||
                      0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tickets in progress
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
                    {sprint?.tickets
                      ?.slice()
                      .filter((x) => x.status.name == "BLOCKED").length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Blocked
                  </Typography>
                </Box>
              </StatCard>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <RecentActivityFeed project={project} sprint={sprint} limit={7} />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Grid container spacing={3}>
            {/* Option 1: Upcoming Deadlines */}
            <Grid size={{ xs: 12 }}>
              <StyledCard>
                <Box sx={{ p: 3 }}>
                  <SectionTitle>Upcoming Deadlines</SectionTitle>
                  <UpcomingDeadlines sprint={sprint} />
                </Box>
              </StyledCard>
            </Grid>

            {/* Option 2: Team Workload */}
            <Grid size={{ xs: 12 }}>
              <StyledCard>
                <Box sx={{ p: 3 }}>
                  <SectionTitle>Team Workload</SectionTitle>
                  <TeamWorkload sprint={sprint} />
                </Box>
              </StyledCard>
            </Grid>

            {/* Option 3: Blockers and Impediments */}
            <Grid size={{ xs: 12 }}>
              <StyledCard>
                <Box sx={{ p: 3 }}>
                  <SectionTitle>Blockers & Impediments</SectionTitle>
                  <BlockersAndImpediments sprint={sprint} />
                </Box>
              </StyledCard>
            </Grid>

            {/* Option 4: Sprint Goals and Milestones */}
            <Grid size={{ xs: 12 }}>
              <StyledCard>
                <Box sx={{ p: 3 }}>
                  <SectionTitle>Sprint Goals & Milestones</SectionTitle>
                  <SprintGoalsAndMilestones sprint={sprint} />
                </Box>
              </StyledCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
};

export default Dashboard;
