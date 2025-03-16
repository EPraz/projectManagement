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
exports.RetrospectiveController = void 0;
const common_1 = require("@nestjs/common");
const retrospective_service_1 = require("./retrospective.service");
const dto_1 = require("../dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let RetrospectiveController = class RetrospectiveController {
    constructor(retrospectiveService) {
        this.retrospectiveService = retrospectiveService;
    }
    async create(createDto) {
        return await this.retrospectiveService.create(createDto);
    }
    async findAll(sprintId) {
        return await this.retrospectiveService.findAll(sprintId);
    }
    async findOne(id) {
        return await this.retrospectiveService.findOne(id);
    }
    async update(id, updateDto) {
        return await this.retrospectiveService.update(id, updateDto);
    }
    async delete(id) {
        return await this.retrospectiveService.delete(id);
    }
};
exports.RetrospectiveController = RetrospectiveController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateRetroCardDto]),
    __metadata("design:returntype", Promise)
], RetrospectiveController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('sprintId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RetrospectiveController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RetrospectiveController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateRetroCardDto]),
    __metadata("design:returntype", Promise)
], RetrospectiveController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RetrospectiveController.prototype, "delete", null);
exports.RetrospectiveController = RetrospectiveController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('retrospectives'),
    __metadata("design:paramtypes", [retrospective_service_1.RetrospectiveService])
], RetrospectiveController);
//# sourceMappingURL=retrospective.controller.js.map