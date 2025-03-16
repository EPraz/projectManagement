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
exports.RetrospectiveService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const helper_1 = require("../helper");
const events_gateway_1 = require("../webSockets/events.gateway");
const constants_1 = require("../constants");
let RetrospectiveService = class RetrospectiveService {
    constructor(prisma, eventsGateway) {
        this.prisma = prisma;
        this.eventsGateway = eventsGateway;
    }
    async create(createDto) {
        try {
            const response = await this.prisma.retroCard.create({
                data: {
                    content: createDto.content,
                    type: createDto.type,
                    authorId: createDto.authorId,
                    sprintId: createDto.sprintId,
                },
            });
            const sprint = await this.prisma.sprint.findUnique({
                where: { id: response.sprintId },
                include: constants_1.SPRINT_INCLUDE,
            });
            if (sprint)
                this.eventsGateway.emitSprintUpdate(sprint);
            return response;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async findAll(sprintId) {
        try {
            return await this.prisma.retroCard.findMany({
                where: sprintId ? { sprintId } : {},
                include: {
                    author: true,
                },
                orderBy: { timestamp: 'asc' },
            });
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async findOne(id) {
        try {
            const card = await this.prisma.retroCard.findUnique({
                where: { id },
                include: { author: true },
            });
            if (!card)
                throw new common_1.NotFoundException(`RetroCard #${id} not found`);
            return card;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async update(id, updateDto) {
        try {
            await this.findOne(id);
            const response = await this.prisma.retroCard.update({
                where: { id },
                data: updateDto,
                include: { author: true },
            });
            const sprint = await this.prisma.sprint.findUnique({
                where: { id: response.sprintId },
                include: constants_1.SPRINT_INCLUDE,
            });
            if (sprint)
                this.eventsGateway.emitSprintUpdate(sprint);
            return response;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async delete(id) {
        try {
            await this.findOne(id);
            const response = await this.prisma.retroCard.delete({ where: { id } });
            const sprint = await this.prisma.sprint.findUnique({
                where: { id: response.sprintId },
                include: constants_1.SPRINT_INCLUDE,
            });
            if (sprint)
                this.eventsGateway.emitSprintUpdate(sprint);
            return true;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
};
exports.RetrospectiveService = RetrospectiveService;
exports.RetrospectiveService = RetrospectiveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway])
], RetrospectiveService);
//# sourceMappingURL=retrospective.service.js.map