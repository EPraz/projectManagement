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
exports.UpdateEpicDto = void 0;
const class_validator_1 = require("class-validator");
class UpdateEpicDto {
}
exports.UpdateEpicDto = UpdateEpicDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'projectId must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'projectId is required' }),
    __metadata("design:type", String)
], UpdateEpicDto.prototype, "projectId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'updatedBy must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'updatedBy is required' }),
    (0, class_validator_1.IsEmail)({}, { message: 'updatedBy Invalid email' }),
    __metadata("design:type", String)
], UpdateEpicDto.prototype, "updatedBy", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'title must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateEpicDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'description must be a string' }),
    __metadata("design:type", String)
], UpdateEpicDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'acceptanceCriteria must be a string' }),
    __metadata("design:type", String)
], UpdateEpicDto.prototype, "acceptanceCriteria", void 0);
//# sourceMappingURL=UpdateEpicDto.js.map