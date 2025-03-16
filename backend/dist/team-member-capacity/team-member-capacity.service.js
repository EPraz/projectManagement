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
exports.TeamMemberCapacityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const helper_1 = require("../helper");
const constants_1 = require("../constants");
const events_gateway_1 = require("../webSockets/events.gateway");
let TeamMemberCapacityService = class TeamMemberCapacityService {
    constructor(prisma, eventsGateway) {
        this.prisma = prisma;
        this.eventsGateway = eventsGateway;
    }
    async create(createDto) {
        try {
            const existingRecord = await this.prisma.teamMemberCapacity.findFirst({
                where: {
                    userId: createDto.userId,
                    sprintId: createDto.sprintId,
                },
            });
            if (existingRecord) {
                throw new common_1.InternalServerErrorException('Capacity record already exists for this user and sprint');
            }
            const response = await this.prisma.teamMemberCapacity.create({
                data: {
                    userId: createDto.userId,
                    sprintId: createDto.sprintId,
                    capacity: createDto.capacity,
                    daysOff: createDto.daysOff,
                    remainingWork: createDto.remainingWork,
                },
                include: { user: true },
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
    async findAllBySprint(sprintId) {
        try {
            return await this.prisma.teamMemberCapacity.findMany({
                where: { sprintId },
                include: { user: true },
            });
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async findOne(id) {
        try {
            const record = await this.prisma.teamMemberCapacity.findUnique({
                where: { id },
                include: { user: true },
            });
            if (!record) {
                throw new common_1.NotFoundException(`Record #${id} not found`);
            }
            return record;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async update(id, updateDto) {
        try {
            const record = await this.prisma.teamMemberCapacity.findUnique({
                where: { id },
            });
            if (!record) {
                throw new common_1.NotFoundException(`Record #${id} not found`);
            }
            const response = await this.prisma.teamMemberCapacity.update({
                where: { id },
                data: {
                    capacity: updateDto.capacity,
                    daysOff: updateDto.daysOff,
                    remainingWork: updateDto.remainingWork,
                },
                include: {
                    user: true,
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
    async delete(id) {
        try {
            const record = await this.prisma.teamMemberCapacity.findUnique({
                where: { id },
            });
            if (!record) {
                throw new common_1.NotFoundException(`Record #${id} not found`);
            }
            await this.prisma.teamMemberCapacity.delete({ where: { id } });
            const sprint = await this.prisma.sprint.findUnique({
                where: { id: record.sprintId },
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
exports.TeamMemberCapacityService = TeamMemberCapacityService;
exports.TeamMemberCapacityService = TeamMemberCapacityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway])
], TeamMemberCapacityService);
//# sourceMappingURL=team-member-capacity.service.js.map