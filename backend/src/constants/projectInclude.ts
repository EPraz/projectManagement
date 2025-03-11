export const PROJECT_INCLUDE = {
  _count: true,
  epics: {
    include: {
      _count: true,
      features: {
        include: {
          status: true,
        },
      },
      status: true,
    },
  },
  users: { include: { projects: true } },
  sprints: {
    include: {
      tickets: {
        include: {
          tasks: {
            include: {
              status: true,
              assignedUser: true,
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
    },
  },
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
  ticketStatuses: true,
  taskStatuses: true,
  epicStatuses: true,
  featureStatuses: true,
};
