"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFeatureOrSprint = validateFeatureOrSprint;
exports.getNewStatus = getNewStatus;
const common_1 = require("@nestjs/common");
async function validateFeatureOrSprint(prisma, featureId, sprintId) {
    let projectId = null;
    if (featureId) {
        const feature = await prisma.feature.findUnique({
            where: { id: featureId },
            include: { epic: true },
        });
        if (!feature)
            throw new common_1.NotFoundException('Feature not found');
        projectId = feature.epic.projectId;
    }
    if (sprintId) {
        const sprint = await prisma.sprint.findUnique({
            where: { id: sprintId },
        });
        if (!sprint)
            throw new common_1.NotFoundException('Sprint not found');
        if (projectId && projectId !== sprint.projectId) {
            throw new common_1.ConflictException('Feature and Sprint do not belong to the same project');
        }
        projectId = sprint.projectId;
    }
    return projectId;
}
async function getNewStatus(prisma, projectId) {
    const status = await prisma.ticketStatus.findFirst({
        where: { projectId, name: 'NEW' },
    });
    if (!status)
        throw new common_1.NotFoundException('Default Ticket Status "NEW" not found');
    return status.id;
}
//# sourceMappingURL=sprintServiceHelper.js.map