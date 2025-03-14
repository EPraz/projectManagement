export const SPRINT_INCLUDE = {
  _count: true,
  tickets: {
    include: {
      status: true,
      tasks: {
        include: {
          status: true,
          assignedUser: true,
        },
      },
      assignedUser: true,
      blockedTickets: true,
      blockingTicket: true,
      feature: true,
      pairProgrammingUsers: true,
      tags: true,
      sprint: true,
    },
  },
  sprintGoal: {
    include: {
      goalTask: true,
    },
  },
  teamMemberCapacities: {
    include: {
      user: true,
    },
  },
  retroCard: {
    include: {
      author: true,
    },
  },
};
