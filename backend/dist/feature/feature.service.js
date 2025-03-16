"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const helper_1 = require("../helper");
let FeatureService = class FeatureService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(request) {
        try {
            const epic = await this.prisma.epic.findUnique({
                where: { id: request.epicId },
            });
            if (!epic)
                throw new common_1.NotFoundException(`Epic #${request.epicId} not found`);
            await (0, helper_1.checkDuplicateTitle)(this.prisma, 'feature', request.title);
            const newStatus = await this.prisma.featureStatus.findFirst({
                where: { projectId: epic.projectId, name: 'NEW' },
            });
            return await this.prisma.feature.create({
                data: { ...request, statusId: newStatus?.id },
                include: {
                    status: true,
                    tickets: true,
                },
            });
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async findAllByEpic(epicId) {
        try {
            const epic = await this.prisma.epic.findUnique({
                where: { id: epicId },
            });
            if (!epic)
                throw new common_1.NotFoundException(`Epic #${epicId} not found`);
            return await this.prisma.feature.findMany({
                where: { epicId },
                include: {
                    _count: true,
                    status: true,
                    tickets: true,
                },
            });
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async findOne(id) {
        try {
            const feature = await this.prisma.feature.findUnique({
                where: { id },
            });
            if (!feature)
                throw new common_1.NotFoundException(`Feature #${id} not found`);
            return await this.prisma.feature.findUnique({
                where: { id },
                include: {
                    _count: true,
                    status: true,
                    tickets: true,
                },
            });
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async update(request) {
        try {
            const epic = await this.prisma.epic.findUnique({
                where: { id: request.epicId },
            });
            if (!epic)
                throw new common_1.NotFoundException(`Feature #${request.epicId} not found`);
            const feature = await this.prisma.feature.findUnique({
                where: { id: request.id },
            });
            if (!feature)
                throw new common_1.NotFoundException(`Feature #${request.id} not found`);
            if (request.title)
                await (0, helper_1.checkDuplicateTitle)(this.prisma, 'feature', request.title);
            return await this.prisma.feature.update({
                where: { id: request.id },
                data: { ...request },
                include: {
                    _count: true,
                    status: true,
                    tickets: true,
                },
            });
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async delete(id) {
        try {
            const feature = await this.prisma.feature.findUnique({
                where: { id },
            });
            if (!feature)
                throw new common_1.NotFoundException(`Feature #${id} not found`);
            await this.prisma.feature.delete({
                where: { id },
            });
            return true;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
};
exports.FeatureService = FeatureService;
exports.FeatureService = FeatureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FeatureService);
//# sourceMappingURL=feature.service.js.map