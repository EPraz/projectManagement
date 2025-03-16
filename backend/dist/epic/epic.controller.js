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
exports.EpicController = void 0;
const common_1 = require("@nestjs/common");
const epic_service_1 = require("./epic.service");
const dto_1 = require("../dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let EpicController = class EpicController {
    constructor(epicService) {
        this.epicService = epicService;
    }
    async create(request) {
        return await this.epicService.create(request);
    }
    async findAll(request) {
        return await this.epicService.findAll(request.projectId);
    }
    async findOne(id) {
        return await this.epicService.findOne(id);
    }
    async update(id, request) {
        return await this.epicService.update({ ...request, id });
    }
    async remove(id) {
        return await this.epicService.delete(id);
    }
};
exports.EpicController = EpicController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateEpicDto]),
    __metadata("design:returntype", Promise)
], EpicController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GetAllEpicsDto]),
    __metadata("design:returntype", Promise)
], EpicController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EpicController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateEpicDto]),
    __metadata("design:returntype", Promise)
], EpicController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EpicController.prototype, "remove", null);
exports.EpicController = EpicController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('epics'),
    __metadata("design:paramtypes", [epic_service_1.EpicService])
], EpicController);
//# sourceMappingURL=epic.controller.js.map