import { Box, Button, Typography } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { LayoutContextProps, Ticket } from "../../types";
import ProjectProfile from "./components/ProjectProfile";
import ProjectMetadata from "./components/ProjectMetadata";
import SprintExecution from "./components/SprintExecution";
import RecentActivityFeed from "./components/recentActivity/RecentActivity";
import SprintMetricsChart from "./components/sprintMetricsChart/SprintMetricsChart";
import UpcomingDeadlines from "./components/upcomingDeadlines/UpcomingDeadlines";
import TeamWorkload from "./components/teamWorkload/TeamWorkload";
import BlockersAndImpediments from "./components/blockersAndImpediments/BlockersAndImpediments";
import SprintGoalsAndMilestones from "./components/sprintGoalsAndMilestones/SprintGoalsAndMilestones";
export default function Dashboard() {
  const {
    project,
    sprint,
    allTickets,
    tickets,
    listOfSprints,
    setSelectedTicket,
    setOpenEditTicketDialog,
  } = useOutletContext<LayoutContextProps>();
  const navigate = useNavigate();
  if (!project) return null;
  const openTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setOpenEditTicketDialog(true);
  };
  return (
    <Box sx={{ minWidth: 0 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline" color="primary">
            Project workspace / Overview
          </Typography>
          <Typography
            component="h1"
            variant="h1"
            sx={{ overflowWrap: "anywhere" }}
          >
            {project.title}
            <Box component="span" sx={{ color: "primary.main" }}>
              .
            </Box>
          </Typography>
        </Box>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={() => navigate(`/projects/${project.id}/board?tab=board`)}
        >
          Open Taskboard
        </Button>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0,1fr)",
            lg: "minmax(280px,.95fr) minmax(0,2fr)",
          },
          gridTemplateAreas: {
            xs: '"execution" "operations" "profile" "calendar" "updates" "metadata" "workload" "goals"',
            lg: '"profile execution" "profile operations" "calendar updates" "metadata workload" "goals goals"',
          },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Box sx={{ gridArea: "execution", minWidth: 0 }}>
          <SprintExecution
            project={project}
            sprint={sprint}
            tickets={tickets}
          />
        </Box>
        <Box
          sx={{
            gridArea: "operations",
            minWidth: 0,
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0,1fr)",
              md: "minmax(0,1.2fr) minmax(0,1fr)",
            },
            gap: 3,
          }}
        >
          <BlockersAndImpediments sprint={sprint} onOpen={openTicket} />
          <SprintMetricsChart
            tickets={tickets}
            statuses={project.ticketStatuses}
          />
        </Box>
        <Box sx={{ gridArea: "profile", minWidth: 0, height: "100%" }}>
          <ProjectProfile project={project} tickets={allTickets} />
        </Box>
        <Box sx={{ gridArea: "calendar", minWidth: 0 }}>
          <UpcomingDeadlines
            key={sprint?.id ?? "none"}
            sprint={sprint}
            onOpen={openTicket}
          />
        </Box>
        <Box sx={{ gridArea: "updates", minWidth: 0 }}>
          <RecentActivityFeed
            project={project}
            allTickets={allTickets}
            tickets={tickets}
            listOfSprints={listOfSprints}
          />
        </Box>
        <Box sx={{ gridArea: "metadata", minWidth: 0 }}>
          <ProjectMetadata project={project} />
        </Box>
        <Box sx={{ gridArea: "workload", minWidth: 0 }}>
          <TeamWorkload tickets={tickets} />
        </Box>
        <Box sx={{ gridArea: "goals", minWidth: 0 }}>
          <SprintGoalsAndMilestones sprint={sprint} />
        </Box>
      </Box>
    </Box>
  );
}
