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
exports.UpdateTicketDto = void 0;
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class UpdateTicketDto {
}
exports.UpdateTicketDto = UpdateTicketDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateTicketDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'title must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'statusId must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "statusId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'sprintId must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "sprintId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'description must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'additionalDetails must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "additionalDetails", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'acceptanceCriteria must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "acceptanceCriteria", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'designInformation must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "designInformation", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'notes must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.TicketPriority, { message: 'priority must be a valid enum value' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true, message: 'Each tag must be a string' }),
    __metadata("design:type", Array)
], UpdateTicketDto.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'assignedTo must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "assignedTo", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'estimatedHours must be a number' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateTicketDto.prototype, "estimatedHours", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'remainingHours must be a number' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateTicketDto.prototype, "remainingHours", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'completedHours must be a number' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateTicketDto.prototype, "completedHours", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'storyPoints must be a number' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateTicketDto.prototype, "storyPoints", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'dueDate must be a valid ISO date string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "dueDate", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'isBlocked must be a boolean' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateTicketDto.prototype, "isBlocked", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'blockedBy must be a number' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateTicketDto.prototype, "blockedBy", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.TicketType, { message: 'type must be a valid enum value' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'updatedBy must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'updatedBy is required' }),
    (0, class_validator_1.IsEmail)({}, { message: 'updatedBy Invalid email' }),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "updatedBy", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'discussion must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTicketDto.prototype, "discussion", void 0);
//# sourceMappingURL=UpdateTicketDto.js.map