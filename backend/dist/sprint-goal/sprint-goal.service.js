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
exports.SprintGoalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const helper_1 = require("../helper");
const constants_1 = require("../constants");
const events_gateway_1 = require("../webSockets/events.gateway");
let SprintGoalService = class SprintGoalService {
    constructor(prisma, eventsGateway) {
        this.prisma = prisma;
        this.eventsGateway = eventsGateway;
    }
    async createGoal(data) {
        try {
            const response = await this.prisma.sprintGoal.create({
                data,
                include: constants_1.SPRINT_GOAL_INCLUDE,
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
    async getSprintGoals(sprintId) {
        try {
            return await this.prisma.sprintGoal.findMany({
                where: { sprintId },
                include: constants_1.SPRINT_GOAL_INCLUDE,
            });
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async updateGoal(request) {
        try {
            const { id, ...data } = request;
            const goal = await this.prisma.sprintGoal.findUnique({
                where: { id },
            });
            if (!goal)
                throw new common_1.NotFoundException('Sprint Goal not found');
            const response = await this.prisma.sprintGoal.update({
                where: { id },
                data,
                include: constants_1.SPRINT_GOAL_INCLUDE,
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
    async deleteGoal(goalId) {
        try {
            const goal = await this.prisma.sprintGoal.findUnique({
                where: { id: goalId },
            });
            if (!goal)
                throw new common_1.NotFoundException('Sprint Goal not found');
            const response = await this.prisma.sprintGoal.delete({
                where: { id: goalId },
            });
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
    async createGoalTask(data) {
        try {
            const response = await this.prisma.goalTask.create({ data });
            const goal = await this.prisma.sprintGoal.findUnique({
                where: { id: data.goalId },
            });
            const sprint = await this.prisma.sprint.findUnique({
                where: { id: goal?.sprintId },
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
    async updateGoalTask(request) {
        try {
            const { id, ...data } = request;
            const task = await this.prisma.goalTask.findUnique({
                where: { id },
            });
            if (!task)
                throw new common_1.NotFoundException('Goal Task not found');
            const response = await this.prisma.goalTask.update({
                where: { id },
                data,
            });
            const goal = await this.prisma.sprintGoal.findUnique({
                where: { id: task.goalId },
            });
            const sprint = await this.prisma.sprint.findUnique({
                where: { id: goal?.sprintId },
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
    async deleteGoalTask(goalTaskId) {
        try {
            const task = await this.prisma.goalTask.findUnique({
                where: { id: goalTaskId },
            });
            if (!task)
                throw new common_1.NotFoundException('Goal Task not found');
            await this.prisma.goalTask.delete({
                where: { id: goalTaskId },
            });
            return true;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
};
exports.SprintGoalService = SprintGoalService;
exports.SprintGoalService = SprintGoalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway])
], SprintGoalService);
//# sourceMappingURL=sprint-goal.service.js.map