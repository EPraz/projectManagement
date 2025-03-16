export declare const SPRINT_INCLUDE: {
    _count: boolean;
    tickets: {
        include: {
            status: boolean;
            tasks: {
                include: {
                    status: boolean;
                    assignedUser: boolean;
                };
            };
            assignedUser: boolean;
            blockedTickets: boolean;
            blockingTicket: boolean;
            feature: boolean;
            pairProgrammingUsers: boolean;
            tags: boolean;
            sprint: boolean;
        };
    };
    sprintGoal: {
        include: {
            goalTask: boolean;
        };
    };
    teamMemberCapacities: {
        include: {
            user: boolean;
        };
    };
    retroCard: {
        include: {
            author: boolean;
        };
    };
};
