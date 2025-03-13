import { Box, Typography, Avatar } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { Project, Sprint, Ticket } from "../../types"; // Adjust import path as needed
import { ActivityCard, ActivityItem, SectionTitle } from "./DashBoard.styles";
import {
  Activity,
  generateActivities,
  getAvatarText,
} from "./RecentActivity.helpers";
import { getRandomColor } from "../../helpers";

interface RecentActivityProps {
  project: Project | null;
  allTickets: Ticket[];
  tickets: Ticket[];
  listOfSprints: Sprint[];
  limit?: number;
}

export const RecentActivityFeed: React.FC<RecentActivityProps> = ({
  project,
  allTickets,
  tickets,
  listOfSprints,
  limit = 7,
}) => {
  const activities: Activity[] = generateActivities(
    project,
    allTickets,
    tickets,
    listOfSprints,
    limit
  );

  // If no activities found
  if (activities.length === 0) {
    return (
      <ActivityCard>
        <SectionTitle variant="h6">Recent Activity</SectionTitle>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ py: 3 }}
        >
          No recent activity found
        </Typography>
      </ActivityCard>
    );
  }

  return (
    <ActivityCard>
      <SectionTitle variant="h6">Recent Activity</SectionTitle>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {activities.map((activity) => (
          <ActivityItem key={activity.id}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: getRandomColor(),
              }}
            >
              {getAvatarText(activity.user.name)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2">
                <strong>{activity.user.name}</strong> {activity.action}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(new Date(activity.timestamp), {
                  addSuffix: true,
                })}
              </Typography>
            </Box>
          </ActivityItem>
        ))}
      </Box>
    </ActivityCard>
  );
};

export default RecentActivityFeed;
