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
exports.TicketService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const helper_1 = require("../helper");
const constants_1 = require("../constants");
const events_gateway_1 = require("../webSockets/events.gateway");
let TicketService = class TicketService {
    constructor(prisma, eventsGateway) {
        this.prisma = prisma;
        this.eventsGateway = eventsGateway;
    }
    async create(request) {
        try {
            const newTicket = await this.prisma.$transaction(async (prisma) => {
                const projectId = await (0, helper_1.validateFeatureOrSprint)(this.prisma, request.featureId, request.sprintId);
                const statusId = projectId
                    ? await (0, helper_1.getNewStatus)(this.prisma, projectId)
                    : null;
                const maxOrder = await prisma.ticket.aggregate({
                    _max: {
                        order: true,
                    },
                    where: {
                        sprintId: request.sprintId ?? undefined,
                        featureId: request.featureId ?? undefined,
                    },
                });
                const nextOrder = (maxOrder._max.order ?? 0) + 1;
                return await prisma.ticket.create({
                    data: {
                        ...request,
                        projectId,
                        statusId,
                        order: nextOrder,
                        tags: request.tags
                            ? {
                                connectOrCreate: request.tags.map((tag) => ({
                                    where: { name: tag },
                                    create: { name: tag },
                                })),
                            }
                            : undefined,
                    },
                    include: constants_1.TICKET_INCLUDE,
                });
            });
            this.eventsGateway.emitTicketCreate(newTicket);
            return newTicket;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async findAllTickets(request) {
        try {
            await (0, helper_1.validateFeatureOrSprint)(this.prisma, request.featureId, request.sprintId);
            return this.prisma.ticket.findMany({
                where: {
                    ...(request.featureId && { featureId: request.featureId }),
                    ...(request.sprintId && { sprintId: request.sprintId }),
                },
                include: constants_1.TICKET_INCLUDE,
                orderBy: {
                    order: 'asc',
                },
            });
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async findOne(id) {
        try {
            const ticket = await this.prisma.ticket.findUnique({
                where: { id },
                include: constants_1.TICKET_INCLUDE,
            });
            if (!ticket)
                throw new common_1.NotFoundException(`Ticket #${id} not found`);
            return ticket;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async update(request) {
        try {
            const ticket = await this.prisma.ticket.findUnique({
                where: { id: request.id },
            });
            if (!ticket)
                throw new common_1.NotFoundException('Ticket not found');
            const { id, ...updateData } = request;
            const response = await this.prisma.ticket.update({
                where: { id },
                data: {
                    ...updateData,
                    tags: request.tags
                        ? {
                            connectOrCreate: request.tags.map((tag) => ({
                                where: { name: tag },
                                create: { name: tag },
                            })),
                        }
                        : undefined,
                },
                include: constants_1.TICKET_INCLUDE,
            });
            this.eventsGateway.emitTicketUpdate(response);
            return response;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async bulkUpdate(request) {
        try {
            const updatedTickets = await this.prisma.$transaction(request.map((ticket) => this.prisma.ticket.update({
                where: { id: ticket.id },
                data: {
                    ...ticket,
                    tags: ticket.tags
                        ? {
                            connectOrCreate: ticket.tags.map((tag) => ({
                                where: { name: tag },
                                create: { name: tag },
                            })),
                        }
                        : undefined,
                },
                include: constants_1.TICKET_INCLUDE,
            })));
            return updatedTickets;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async deleteAll() {
        await this.prisma.ticket.deleteMany();
    }
    async delete(id) {
        try {
            const ticket = await this.prisma.ticket.findUnique({ where: { id } });
            if (!ticket)
                throw new common_1.NotFoundException('Ticket not found');
            this.eventsGateway.emitTicketDelete(ticket);
            await this.prisma.ticket.delete({ where: { id } });
            return true;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
};
exports.TicketService = TicketService;
exports.TicketService = TicketService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway])
], TicketService);
//# sourceMappingURL=ticket.service.js.map