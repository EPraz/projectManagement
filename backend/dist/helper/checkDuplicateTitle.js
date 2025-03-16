"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDuplicateTitle = checkDuplicateTitle;
const common_1 = require("@nestjs/common");
async function checkDuplicateTitle(prisma, model, title) {
    let existingRecord;
    switch (model) {
        case 'project':
            existingRecord = await prisma.project.findFirst({
                where: { title: { equals: title.trim(), mode: 'insensitive' } },
            });
            break;
        case 'epic':
            existingRecord = await prisma.epic.findFirst({
                where: { title: { equals: title.trim(), mode: 'insensitive' } },
            });
            break;
        case 'feature':
            existingRecord = await prisma.feature.findFirst({
                where: { title: { equals: title.trim(), mode: 'insensitive' } },
            });
            break;
    }
    if (existingRecord) {
        throw new common_1.ConflictException(`This ${model} title already exists`);
    }
}
//# sourceMappingURL=checkDuplicateTitle.js.map