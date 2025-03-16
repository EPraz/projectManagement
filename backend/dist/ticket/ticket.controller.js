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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const ticket_service_1 = require("./ticket.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let TicketController = class TicketController {
    constructor(ticketService) {
        this.ticketService = ticketService;
    }
    async create(newTicket) {
        return await this.ticketService.create(newTicket);
    }
    async findAll(featureId, sprintId, ticketStatusId) {
        if (!featureId && !sprintId && !ticketStatusId) {
            throw new common_1.BadRequestException('Either featureId, sprintId, or ticketStatusId is required');
        }
        if ((featureId && sprintId) ||
            (featureId && ticketStatusId) ||
            (sprintId && ticketStatusId)) {
            throw new common_1.BadRequestException('Only one of featureId, sprintId, or ticketStatusId should be provided');
        }
        return await this.ticketService.findAllTickets({
            featureId,
            sprintId,
            ticketStatusId,
        });
    }
    async findOne(id) {
        return await this.ticketService.findOne(id);
    }
    async bulkUpdate(request) {
        return await this.ticketService.bulkUpdate(request);
    }
    async update(id, request) {
        return await this.ticketService.update({ ...request, id });
    }
    async deleteAll() {
        await this.ticketService.deleteAll();
    }
    async delete(id) {
        return await this.ticketService.delete(id);
    }
};
exports.TicketController = TicketController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateTicketDto]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('featureId')),
    __param(1, (0, common_1.Query)('sprintId')),
    __param(2, (0, common_1.Query)('ticketStatusId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('bulk-update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "bulkUpdate", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateTicketDto]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('all'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "deleteAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "delete", null);
exports.TicketController = TicketController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('tickets'),
    __metadata("design:paramtypes", [ticket_service_1.TicketService])
], TicketController);
//# sourceMappingURL=ticket.controller.js.map