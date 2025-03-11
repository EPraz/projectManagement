import {
  CapacityMetric,
  Header,
  MetricLabel,
  MetricValue,
} from "./CapacityBoard.styles";
import { Box, Button, Chip, Typography } from "@mui/material";
import {
  Add as AddIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon,
  WorkOutline as WorkOutlineIcon,
} from "@mui/icons-material";
import { Sprint, TeamMemberCapacity } from "../../../types";

type CapacityBoardHeaderProps = {
  sprint: Sprint | null;
  teamMembers: TeamMemberCapacity[];
  totalCapacity: number;
  totalRemaining: number;
  handleOpenAddDialog: () => void;
};

const CapacityBoardHeader = ({
  sprint,
  totalCapacity,
  totalRemaining,
  teamMembers,
  handleOpenAddDialog,
}: CapacityBoardHeaderProps) => {
  return (
    <Header>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          Team Capacity
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {sprint?.name ? (
            <>
              Sprint:{" "}
              <Chip
                label={sprint.name}
                size="small"
                sx={{
                  ml: 1,
                  bgcolor: "primary.main",
                  color: "white",
                  fontWeight: 500,
                }}
              />
            </>
          ) : (
            "No active sprint"
          )}
        </Typography>
      </Box>

      {/* Summary metrics */}
      {teamMembers.length > 0 && (
        <Box sx={{ display: "flex", gap: 2, mr: 4 }}>
          <CapacityMetric>
            <AccessTimeIcon color="secondary" />
            <Box>
              <MetricLabel>Total Capacity</MetricLabel>
              <MetricValue>{totalCapacity}h</MetricValue>
            </Box>
          </CapacityMetric>

          <CapacityMetric>
            <WorkOutlineIcon color="secondary" />
            <Box>
              <MetricLabel>Remaining</MetricLabel>
              <MetricValue>{totalRemaining}h</MetricValue>
            </Box>
          </CapacityMetric>

          <CapacityMetric>
            <CalendarTodayIcon color="secondary" />
            <Box>
              <MetricLabel>Team Members</MetricLabel>
              <MetricValue>{teamMembers.length}</MetricValue>
            </Box>
          </CapacityMetric>
        </Box>
      )}

      <Button
        startIcon={<AddIcon />}
        variant="contained"
        sx={{
          px: 3,
          py: 1,
          borderRadius: 1,
          textTransform: "none",
          fontWeight: 500,
          bgcolor: "primary.main",
          "&:hover": {
            bgcolor: "primary.dark",
          },
        }}
        onClick={handleOpenAddDialog}
        disabled={!sprint?.id}
      >
        Add team member
      </Button>
    </Header>
  );
};

export default CapacityBoardHeader;
