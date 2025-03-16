"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TICKET_INCLUDE = void 0;
exports.TICKET_INCLUDE = {
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
//# sourceMappingURL=ticketInclude.js.map