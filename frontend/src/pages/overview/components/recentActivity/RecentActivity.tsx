import { Avatar, Box, Typography } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import type { Project, Sprint, Ticket } from "../../../../types";
import { generateActivities, getAvatarText } from "./RecentActivity.helpers";
export default function RecentActivityFeed({
  project,
  allTickets,
  tickets,
  listOfSprints,
  limit = 6,
}: {
  project: Project | null;
  allTickets: Ticket[];
  tickets: Ticket[];
  listOfSprints: Sprint[];
  limit?: number;
}) {
  const updates = generateActivities(
    project,
    allTickets,
    tickets,
    listOfSprints,
    limit,
  );
  return (
    <Box sx={{ minWidth: 0 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 1,
          mb: 2,
        }}
      >
        <Typography component="h2" variant="h3">
          Recent updates
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Project-wide
        </Typography>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0,1fr)",
            sm: "repeat(2,minmax(0,1fr))",
          },
          gap: 2,
        }}
      >
        {updates.map((update) => (
          <Box
            key={update.id}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              minWidth: 0,
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "primary.light",
                color: "primary.main",
                fontSize: 11,
              }}
            >
              {getAvatarText(update.user.name)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
                {update.action}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {update.user.name} ·{" "}
                {formatDistanceToNow(new Date(update.timestamp), {
                  addSuffix: true,
                })}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      {!updates.length && (
        <Typography variant="body2" color="text.secondary">
          No known updates yet.
        </Typography>
      )}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 2 }}
      >
        Known creations and latest modifications, based on item timestamps. This
        is not an audit history.
      </Typography>
    </Box>
  );
}
