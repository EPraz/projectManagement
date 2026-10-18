import { Box, Button, Paper, Tooltip, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import type { Sprint, TeamMemberCapacity } from "../../../../../types";
type Props = {
  sprint: Sprint | null;
  teamMembers: TeamMemberCapacity[];
  totalCapacity: number;
  totalRemaining: number;
  handleOpenAddDialog: () => void;
  addDisabledReason?: string;
};
export default function CapacityBoardHeader({
  sprint,
  teamMembers,
  totalCapacity,
  totalRemaining,
  handleOpenAddDialog,
  addDisabledReason,
}: Props) {
  return (
    <Box sx={{ display: "grid", gap: 3 }}>
      <Box
        sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}
      >
        <Box sx={{ flex: "1 1 200px" }}>
          <Typography component="h2" variant="h3">
            Team Capacity
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {sprint?.name ?? "No active sprint"}
          </Typography>
        </Box>
        <Tooltip title={addDisabledReason ?? ""}>
          <span>
            <Button
              startIcon={<Add />}
              variant="contained"
              onClick={handleOpenAddDialog}
              disabled={Boolean(addDisabledReason) || !sprint}
            >
              Add capacity
            </Button>
          </span>
        </Tooltip>
      </Box>
      {addDisabledReason && sprint && (
        <Typography variant="body2" color="text.secondary">
          {addDisabledReason}
        </Typography>
      )}
      {sprint && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2,minmax(0,1fr))",
              sm: "repeat(3,minmax(0,1fr))",
            },
            gap: 2,
          }}
        >
          {[
            ["Total Capacity", `${totalCapacity}h`],
            ["Remaining", `${totalRemaining}h`],
            ["Members with capacity", String(teamMembers.length)],
          ].map(([label, value], index) => (
            <Paper
              variant="outlined"
              key={label}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: "12px",
                minWidth: 0,
                gridColumn: { xs: index === 2 ? "1 / -1" : "auto", sm: "auto" },
                display: { xs: index === 2 ? "flex" : "block", sm: "block" },
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
              <Typography
                sx={{
                  mt: { xs: index === 2 ? 0 : 1, sm: 1 },
                  fontSize: { xs: 26, sm: 30 },
                  fontWeight: 600,
                  overflowWrap: "anywhere",
                }}
              >
                {value}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}
