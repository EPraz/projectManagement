import type { Project } from "../types/models/Project";
import type { Sprint } from "../types/models/Sprint";

type WorkspaceRead = Omit<Project, "sprints"> & {
  sprints: Omit<Sprint, "tickets">[];
};

// HTTP workspace reads omit the redundant nested work collection. The same
// projection also reconciles full socket snapshots and local confirmed edits.
export const synchronizeProjectTickets = (project: WorkspaceRead): Project => ({
  ...project,
  sprints: project.sprints.map((sprint) => ({
    ...sprint,
    tickets: project.tickets.filter((ticket) => ticket.sprintId === sprint.id)
  }))
});
export type { WorkspaceRead };
