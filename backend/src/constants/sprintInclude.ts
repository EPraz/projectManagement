export const SPRINT_INCLUDE = {
  _count: true,
  tickets: {
    include: {
      tasks: {
        include: {
          status: true,
        },
      },
      status: true,
      blockedTickets: true,
      assignedUser: true,
      blockingTicket: true,
      tags: true,
    },
  },
  sprintGoal: {
    include: {
      goalTask: true,
    },
  },
};
