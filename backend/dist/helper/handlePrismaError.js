"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePrismaError = handlePrismaError;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
function handlePrismaError(error) {
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        throw new common_1.InternalServerErrorException(`Error Prisma: ${error.message}`);
    }
    throw error;
}
//# sourceMappingURL=handlePrismaError.js.map