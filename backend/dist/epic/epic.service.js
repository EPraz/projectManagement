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
exports.EpicService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const helper_1 = require("../helper");
let EpicService = class EpicService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(request) {
        try {
            const project = await this.prisma.project.findUnique({
                where: { id: request.projectId },
            });
            if (!project)
                throw new common_1.NotFoundException(`Project #${request.projectId} not found`);
            await (0, helper_1.checkDuplicateTitle)(this.prisma, 'epic', request.title);
            const newStatus = await this.prisma.epicStatus.findFirst({
                where: { projectId: request.projectId, name: 'NEW' },
            });
            return await this.prisma.epic.create({
                data: { ...request, statusId: newStatus?.id },
                include: {
                    features: true,
                    status: true,
                },
            });
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async findAll(projectId) {
        try {
            const project = await this.prisma.project.findUnique({
                where: { id: projectId },
            });
            if (!project) {
                throw new common_1.NotFoundException(`Project #${projectId} not found`);
            }
            return await this.prisma.epic.findMany({
                where: { projectId },
                include: {
                    _count: true,
                    features: true,
                    status: true,
                },
            });
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async findOne(id) {
        try {
            const epic = await this.prisma.epic.findUnique({
                where: { id },
            });
            if (!epic)
                throw new common_1.NotFoundException(`Epic #${id} not found`);
            return await this.prisma.epic.findUnique({
                where: { id },
                include: {
                    features: true,
                    status: true,
                },
            });
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async update(request) {
        try {
            const project = await this.prisma.project.findUnique({
                where: { id: request.projectId },
            });
            if (!project) {
                throw new common_1.NotFoundException(`Project #${request.projectId} not found`);
            }
            const epic = await this.prisma.epic.findUnique({
                where: { id: request.id },
            });
            if (!epic)
                throw new common_1.NotFoundException(`Epic #${request.id} not found`);
            if (request.title)
                await (0, helper_1.checkDuplicateTitle)(this.prisma, 'epic', request.title);
            return await this.prisma.epic.update({
                where: { id: request.id },
                data: request,
                include: {
                    features: true,
                    status: true,
                },
            });
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async delete(id) {
        try {
            const epic = await this.prisma.epic.findUnique({
                where: { id },
            });
            if (!epic)
                throw new common_1.NotFoundException(`Epic #${id} not found`);
            await this.prisma.epic.delete({ where: { id } });
            return true;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
};
exports.EpicService = EpicService;
exports.EpicService = EpicService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EpicService);
//# sourceMappingURL=epic.service.js.map