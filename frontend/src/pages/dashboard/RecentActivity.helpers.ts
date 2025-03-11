import { Project, Sprint } from "../../types";

// Activity type definition
export interface Activity {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  action: string;
  target?: string;
  timestamp: string;
}

// Generate activities from project and sprint data
export const generateActivities = (
  project: Project | null,
  sprint: Sprint | null,
  limit: number
): Activity[] => {
  const activities: Activity[] = [];

  if (project) {
    // Project creation
    activities.push({
      id: `project-created-${project.id}`,
      user: {
        id: project.createdBy,
        name: getUserName(project.createdBy, project) || "A user",
      },
      action: "created the project",
      timestamp: project.createdAt,
    });

    // Add activities from tickets
    if (project.tickets) {
      project.tickets.forEach((ticket) => {
        // Ticket creation
        activities.push({
          id: `ticket-created-${ticket.id}`,
          user: {
            id: ticket.createdBy,
            name: getUserName(ticket.createdBy, project) || "A user",
          },
          action: `created ticket "${ticket.title}"`,
          timestamp: ticket.createdAt,
        });

        // Ticket updates
        if (ticket.updatedBy && ticket.updatedAt !== ticket.createdAt) {
          activities.push({
            id: `ticket-updated-${ticket.id}-${ticket.updatedAt}`,
            user: {
              id: ticket.updatedBy,
              name: getUserName(ticket.updatedBy, project) || "A user",
            },
            action: `updated ticket "${ticket.title}"`,
            timestamp: ticket.updatedAt,
          });
        }

        // Ticket assignments
        if (ticket.assignedTo) {
          activities.push({
            id: `ticket-assigned-${ticket.id}-${ticket.assignedTo}`,
            user: {
              id: ticket.updatedBy || ticket.createdBy,
              name:
                getUserName(ticket.updatedBy || ticket.createdBy, project) ||
                "A user",
            },
            action: `assigned ticket "${ticket.title}" to ${
              getUserName(ticket.assignedTo, project) || "a team member"
            }`,
            timestamp: ticket.updatedAt || ticket.createdAt,
          });
        }
      });
    }

    // Add activities from sprints
    if (project.sprints) {
      project.sprints.forEach((sprint) => {
        activities.push({
          id: `sprint-created-${sprint.id}`,
          user: {
            id: project.createdBy, // Assuming the project creator also created the sprint
            name: getUserName(project.createdBy, project) || "A user",
          },
          action: `created sprint "${sprint.name}"`,
          timestamp: sprint.createdAt,
        });
      });
    }
  }

  // If we have a specific sprint, add its ticket activities
  if (sprint) {
    if (sprint.tickets) {
      sprint.tickets.forEach((ticket) => {
        // Only add if not already added from project
        const ticketCreationId = `ticket-created-${ticket.id}`;
        if (!activities.some((a) => a.id === ticketCreationId)) {
          activities.push({
            id: ticketCreationId,
            user: {
              id: ticket.createdBy,
              name: getUserName(ticket.createdBy, project) || "A user",
            },
            action: `added ticket "${ticket.title}" to sprint "${sprint.name}"`,
            timestamp: ticket.createdAt,
          });
        }

        // Status changes (inferred from updatedAt being different from createdAt)
        if (ticket.updatedBy && ticket.updatedAt !== ticket.createdAt) {
          activities.push({
            id: `ticket-status-${ticket.id}-${ticket.updatedAt}`,
            user: {
              id: ticket.updatedBy,
              name: getUserName(ticket.updatedBy, project) || "A user",
            },
            action: `updated status of "${ticket.title}" to ${
              ticket.status?.name || "a new status"
            }`,
            timestamp: ticket.updatedAt,
          });
        }
      });
    }
  }

  // Sort by timestamp (newest first) and limit
  return activities
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, limit);
};

// Helper function to get user name from ID
export const getUserName = (
  userEmail: string,
  project: Project | null
): string | null => {
  if (!project || !project.users) return null;

  const projectUser = project.users.find((pu) => pu.email === userEmail);
  if (projectUser && projectUser.name) {
    return projectUser.name;
  }

  // Check product managers
  if (project.productManagers) {
    const manager = project.productManagers.find(
      (pm) => pm.email === userEmail
    );
    if (manager) return manager.name;
  }

  return null;
};

// Generate avatar text from name
export const getAvatarText = (name: string): string => {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name[0];
};
