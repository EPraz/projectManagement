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
exports.CreateFeatureDto = void 0;
const class_validator_1 = require("class-validator");
class CreateFeatureDto {
}
exports.CreateFeatureDto = CreateFeatureDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'title must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'title is required' }),
    __metadata("design:type", String)
], CreateFeatureDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'description must be a string' }),
    __metadata("design:type", String)
], CreateFeatureDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'acceptanceCriteria must be a string' }),
    __metadata("design:type", String)
], CreateFeatureDto.prototype, "acceptanceCriteria", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'discussion must be a string' }),
    __metadata("design:type", String)
], CreateFeatureDto.prototype, "discussion", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'createdBy must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'createdBy is required' }),
    (0, class_validator_1.IsEmail)({}, { message: 'createdBy Invalid email' }),
    __metadata("design:type", String)
], CreateFeatureDto.prototype, "createdBy", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'epicId must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'epicId is required' }),
    __metadata("design:type", String)
], CreateFeatureDto.prototype, "epicId", void 0);
//# sourceMappingURL=CreateFeatureDto.js.map