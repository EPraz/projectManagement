import { Prisma } from '@prisma/client';
import { PROJECT_INCLUDE } from './projectInclude';

export const PROJECT_SUMMARY_INCLUDE = {
  tickets: { select: { statusId: true } },
  sprints: { select: { id: true } },
  users: { select: { id: true, name: true, email: true } },
  ticketStatuses: { select: { id: true, name: true } },
} satisfies Prisma.ProjectInclude;

// Workspace state projects sprint tickets from the complete root collection.
// Default reads and existing socket payloads retain their original contract.
export const PROJECT_WORKSPACE_INCLUDE = {
  ...PROJECT_INCLUDE,
  sprints: {
    include: {
      sprintGoal: PROJECT_INCLUDE.sprints.include.sprintGoal,
      teamMemberCapacities:
        PROJECT_INCLUDE.sprints.include.teamMemberCapacities,
      retroCard: PROJECT_INCLUDE.sprints.include.retroCard,
    },
  },
} satisfies Prisma.ProjectInclude;
