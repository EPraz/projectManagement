export declare const PROJECT_INCLUDE: {
    _count: boolean;
    epics: {
        include: {
            _count: boolean;
            features: {
                include: {
                    status: boolean;
                };
            };
            status: boolean;
        };
    };
    users: {
        include: {
            projects: boolean;
        };
    };
    sprints: {
        include: {
            tickets: {
                include: {
                    tasks: {
                        include: {
                            status: boolean;
                            assignedUser: boolean;
                        };
                    };
                    status: boolean;
                    blockedTickets: boolean;
                    assignedUser: boolean;
                    blockingTicket: boolean;
                    tags: boolean;
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
    };
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
    ticketStatuses: boolean;
    taskStatuses: boolean;
    epicStatuses: boolean;
    featureStatuses: boolean;
};
