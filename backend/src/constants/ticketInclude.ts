export const TICKET_INCLUDE = {
  _count: true,
  status: true,
  tasks: {
    include: {
      status: true,
      assignedUser: true,
    },
  },
  sprint: true,
  assignedUser: true,
  blockedTickets: true,
  blockingTicket: true,
  feature: true,
  pairProgrammingUsers: true,
  project: true,
  tags: true,
};
