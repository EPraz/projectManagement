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
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const helper_1 = require("../helper");
const prisma_service_1 = require("../prisma/prisma.service");
const events_gateway_1 = require("../webSockets/events.gateway");
let ProjectService = class ProjectService {
    constructor(prisma, eventsGateway) {
        this.prisma = prisma;
        this.eventsGateway = eventsGateway;
    }
    async create(request) {
        try {
            await (0, helper_1.checkDuplicateTitle)(this.prisma, 'project', request.title);
            return await this.prisma.$transaction(async (prisma) => {
                const newProject = await prisma.project.create({
                    data: {
                        ...request,
                    },
                });
                await prisma.epicStatus.createMany({
                    data: constants_1.defaultEpicStatuses.map((status) => ({
                        ...status,
                        projectId: String(newProject.id),
                    })),
                });
                await prisma.featureStatus.createMany({
                    data: constants_1.defaultFeatureStatuses.map((status) => ({
                        ...status,
                        projectId: String(newProject.id),
                    })),
                });
                await prisma.ticketStatus.createMany({
                    data: constants_1.defaultTicketStatuses.map((status) => ({
                        ...status,
                        projectId: String(newProject.id),
                    })),
                });
                await prisma.taskStatus.createMany({
                    data: constants_1.defaultTaskStatuses.map((status) => ({
                        ...status,
                        projectId: String(newProject.id),
                    })),
                });
                return prisma.project.findUnique({
                    where: { id: newProject.id },
                    include: constants_1.PROJECT_INCLUDE,
                });
            });
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async findAll() {
        try {
            return await this.prisma.project.findMany({
                include: constants_1.PROJECT_INCLUDE,
            });
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async findOne(id) {
        try {
            const project = await this.prisma.project.findUnique({
                where: { id },
                include: constants_1.PROJECT_INCLUDE,
            });
            if (!project)
                throw new common_1.NotFoundException(`Project #${id} not found!`);
            return project;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async update(request) {
        try {
            const project = await this.prisma.project.findUnique({
                where: { id: request.id },
            });
            if (!project)
                throw new common_1.NotFoundException(`Project #${request.id} not found!`);
            if (request.title)
                await (0, helper_1.checkDuplicateTitle)(this.prisma, 'project', request.title);
            const response = await this.prisma.project.update({
                where: { id: request.id },
                data: { ...request },
                include: constants_1.PROJECT_INCLUDE,
            });
            this.eventsGateway.emitProjectUpdate(response);
            return response;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async remove(id) {
        try {
            const project = await this.prisma.project.findUnique({
                where: { id },
            });
            if (!project)
                throw new common_1.NotFoundException(`Project #${id} not found!`);
            await this.prisma.project.delete({ where: { id } });
            return true;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async assignUserToProject(projectId, userId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: { users: true },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (project.users.some((u) => u.id === userId)) {
            throw new common_1.ConflictException('User already assigned to this project');
        }
        const updatedProject = await this.prisma.project.update({
            where: { id: projectId },
            data: {
                users: {
                    connect: { id: userId },
                },
            },
            include: constants_1.PROJECT_INCLUDE,
        });
        this.eventsGateway.emitProjectUpdate(updatedProject);
        return updatedProject.users;
    }
    async removeUserFromProject(projectId, userId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: { users: true },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const response = await this.prisma.project.update({
            where: { id: projectId },
            data: {
                users: {
                    disconnect: { id: userId },
                },
            },
            include: constants_1.PROJECT_INCLUDE,
        });
        this.eventsGateway.emitProjectUpdate(response);
        return response.users;
    }
};
exports.ProjectService = ProjectService;
exports.ProjectService = ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway])
], ProjectService);
//# sourceMappingURL=project.service.js.map