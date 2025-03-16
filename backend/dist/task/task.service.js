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
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const helper_1 = require("../helper");
const events_gateway_1 = require("../webSockets/events.gateway");
const constants_1 = require("../constants");
let TaskService = class TaskService {
    constructor(prisma, eventsGateway) {
        this.prisma = prisma;
        this.eventsGateway = eventsGateway;
    }
    async create(request) {
        try {
            const ticket = await this.prisma.ticket.findUnique({
                where: { id: request.ticketId },
            });
            if (!ticket)
                throw new common_1.NotFoundException('Ticket not found');
            const newTaskStatus = await this.prisma.taskStatus.findFirst({
                where: {
                    projectId: ticket.projectId,
                    name: 'TODO',
                },
            });
            const newTask = await this.prisma.task.create({
                data: { ...request, statusId: newTaskStatus?.id },
                include: {
                    status: true,
                },
            });
            const updatedticket = await this.prisma.ticket.findUnique({
                where: { id: request.ticketId },
                include: constants_1.TICKET_INCLUDE,
            });
            if (updatedticket)
                this.eventsGateway.emitTicketUpdate(updatedticket);
            return newTask;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async findAllByTicket(ticketId) {
        try {
            const ticket = await this.prisma.ticket.findUnique({
                where: { id: ticketId },
            });
            if (!ticket)
                throw new common_1.NotFoundException('Ticket not found');
            return await this.prisma.task.findMany({
                where: { ticketId },
                include: {
                    status: true,
                    assignedUser: true,
                },
            });
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async findOne(id) {
        try {
            const task = await this.prisma.task.findUnique({
                where: { id },
                include: {
                    status: true,
                },
            });
            if (!task)
                throw new common_1.NotFoundException('Task not found');
            return task;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async update(request) {
        try {
            const task = await this.prisma.task.findUnique({
                where: { id: request.id },
                include: {
                    status: true,
                },
            });
            if (!task)
                throw new common_1.NotFoundException('Task not found');
            const { id, ...updateData } = request;
            const response = await this.prisma.task.update({
                where: { id },
                data: { ...updateData },
                include: {
                    status: true,
                },
            });
            const ticket = await this.prisma.ticket.findUnique({
                where: { id: response.ticketId },
                include: constants_1.TICKET_INCLUDE,
            });
            if (ticket)
                this.eventsGateway.emitTicketUpdate(ticket);
            return response;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async delete(id) {
        try {
            const task = await this.prisma.task.findUnique({
                where: { id },
            });
            if (!task)
                throw new common_1.NotFoundException('Task not found');
            await this.prisma.task.delete({
                where: { id },
            });
            const ticket = await this.prisma.ticket.findUnique({
                where: { id: task.ticketId },
                include: constants_1.TICKET_INCLUDE,
            });
            if (ticket)
                this.eventsGateway.emitTicketUpdate(ticket);
            return true;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway])
], TaskService);
//# sourceMappingURL=task.service.js.map