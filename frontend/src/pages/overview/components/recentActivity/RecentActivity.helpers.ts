import type { Project, Sprint, Ticket } from "../../../../types";
export interface Activity {
  id: string;
  user: { id: string; name: string; avatar?: string };
  action: string;
  target?: string;
  timestamp: string;
}
type TimestampedItem = {
  id: string | number;
  title: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
};
// These are known creations and latest modifications, never a reconstructed audit log.
export const generateActivities = (
  project: Project | null,
  allTickets: Ticket[],
  tickets: Ticket[],
  listOfSprints: Sprint[],
  limit: number,
): Activity[] => {
  const updates: Activity[] = [];
  const append = (kind: string, item: TimestampedItem) => {
    const add = (verb: string, timestamp?: string, actor?: string) => {
      if (!timestamp || !Number.isFinite(Date.parse(timestamp))) return;
      updates.push({
        id: `${kind}-${item.id}-${verb}`,
        user: {
          id: actor || "",
          name: getUserName(actor || "", project) || "Unknown author",
        },
        action: `${verb} ${kind} "${item.title}"`,
        timestamp,
      });
    };
    add("created", item.createdAt, item.createdBy);
    if (item.updatedAt !== item.createdAt)
      add("updated", item.updatedAt, item.updatedBy);
  };
  if (project) append("project", project);
  const uniqueTickets = new Map(
    [...tickets, ...allTickets].map((ticket) => [ticket.id, ticket]),
  );
  uniqueTickets.forEach((ticket) => {
    append("ticket", ticket);
    ticket.tasks.forEach((task) => append("task", task));
  });
  listOfSprints.forEach((sprint) =>
    append("sprint", { ...sprint, title: sprint.name }),
  );
  return updates
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
    .slice(0, limit);
};

export const getUserName = (
  userEmail: string,
  project: Project | null,
): string | null => {
  if (!project || !project.users) return null;
  const projectUser = project.users.find((pu) => pu.email === userEmail);
  if (projectUser && projectUser.name) {
    return projectUser.name;
  }

  // Check product managers
  if (project.productManagers) {
    const manager = project.productManagers.find(
      (pm) => pm.email === userEmail,
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
