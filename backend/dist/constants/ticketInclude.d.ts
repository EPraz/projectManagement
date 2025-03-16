export declare const TICKET_INCLUDE: {
    _count: boolean;
    status: boolean;
    tasks: {
        include: {
            status: boolean;
            assignedUser: boolean;
        };
    };
    sprint: boolean;
    assignedUser: boolean;
    blockedTickets: boolean;
    blockingTicket: boolean;
    feature: boolean;
    pairProgrammingUsers: boolean;
    project: boolean;
    tags: boolean;
};
