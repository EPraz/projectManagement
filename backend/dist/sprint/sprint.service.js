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
exports.SprintService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const helper_1 = require("../helper");
const prisma_service_1 = require("../prisma/prisma.service");
const events_gateway_1 = require("../webSockets/events.gateway");
let SprintService = class SprintService {
    constructor(prisma, eventsGateway) {
        this.prisma = prisma;
        this.eventsGateway = eventsGateway;
    }
    async create(request) {
        try {
            const project = await this.prisma.project.findUnique({
                where: { id: request.projectId },
            });
            if (!project)
                throw new common_1.NotFoundException('Project not found');
            const response = await this.prisma.sprint.create({
                data: { ...request },
                include: constants_1.SPRINT_INCLUDE,
            });
            this.eventsGateway.emitSprintCreate(response);
            return response;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async getSprintsByProject(projectId) {
        try {
            const project = await this.prisma.project.findUnique({
                where: { id: projectId },
            });
            if (!project)
                throw new common_1.NotFoundException('Project not found');
            return await this.prisma.sprint.findMany({
                where: { projectId },
                orderBy: { createdAt: 'desc' },
                include: constants_1.SPRINT_INCLUDE,
            });
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async findOne(id) {
        try {
            const sprint = await this.prisma.sprint.findUnique({
                where: { id },
                include: constants_1.SPRINT_INCLUDE,
            });
            if (!sprint)
                throw new common_1.NotFoundException('Sprint not found');
            return sprint;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async update(request) {
        try {
            const sprint = await this.prisma.sprint.findUnique({
                where: { id: request.id },
                include: constants_1.SPRINT_INCLUDE,
            });
            if (!sprint)
                throw new common_1.NotFoundException('Sprint not found');
            const { tickets, ...updateData } = request;
            const response = await this.prisma.sprint.update({
                where: { id: request.id },
                data: {
                    ...updateData,
                    ...(tickets && {
                        tickets: {
                            updateMany: tickets.map((ticket) => ({
                                where: { id: ticket.id },
                                data: {
                                    ...tickets,
                                },
                            })),
                        },
                    }),
                },
                include: constants_1.SPRINT_INCLUDE,
            });
            this.eventsGateway.emitSprintUpdate(response);
            return response;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async delete(id) {
        try {
            const sprint = await this.prisma.sprint.findUnique({
                where: { id },
            });
            if (!sprint)
                throw new common_1.NotFoundException('Sprint not found');
            const response = await this.prisma.sprint.delete({
                where: { id },
            });
            this.eventsGateway.emitSprintDelete(response);
            return true;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
};
exports.SprintService = SprintService;
exports.SprintService = SprintService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway])
], SprintService);
//# sourceMappingURL=sprint.service.js.map