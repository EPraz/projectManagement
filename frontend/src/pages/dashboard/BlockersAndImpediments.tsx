import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Chip,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import { Sprint } from "../../types";
import { TaskCard } from "./DashBoard.styles";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const BlockersAndImpediments = ({ sprint }: { sprint?: Sprint | null }) => {
  // Get blocked tickets
  const blockedTickets =
    sprint?.tickets?.filter((ticket) => ticket.isBlocked).slice(0, 4) || [];

  if (blockedTickets.length === 0) {
    return (
      <Alert severity="success" sx={{ mb: 3 }}>
        <AlertTitle>No Blockers</AlertTitle>
        All tickets are currently unblocked
      </Alert>
    );
  }

  return (
    <>
      <Alert severity="warning" sx={{ mb: 3 }}>
        <AlertTitle>Attention Required</AlertTitle>
        {blockedTickets.length} ticket
        {blockedTickets.length > 1 ? "s are" : " is"} currently blocked
      </Alert>

      <Grid container spacing={3}>
        {blockedTickets.map((ticket, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={`${ticket.id}_${index}`}>
            <TaskCard>
              <Avatar sx={{ bgcolor: "error.main" }}>
                <WarningAmberIcon width={20} height={20} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {ticket.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ticket.assignedUser?.name || "Unassigned"}
                </Typography>
              </Box>
              <Chip
                label="Blocked"
                color="error"
                size="small"
                variant="outlined"
              />
            </TaskCard>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
export default BlockersAndImpediments;
