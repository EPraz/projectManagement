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
exports.SprintGoalController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("../dto");
const sprint_goal_service_1 = require("./sprint-goal.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let SprintGoalController = class SprintGoalController {
    constructor(sprintGoalService) {
        this.sprintGoalService = sprintGoalService;
    }
    async createGoal(data) {
        return await this.sprintGoalService.createGoal(data);
    }
    async updateGoal(goalId, data) {
        return await this.sprintGoalService.updateGoal({ ...data, id: goalId });
    }
    async deleteGoal(goalId) {
        return await this.sprintGoalService.deleteGoal(goalId);
    }
    async getSprintGoals(sprintId) {
        return await this.sprintGoalService.getSprintGoals(sprintId);
    }
    async createGoalTask(data) {
        return await this.sprintGoalService.createGoalTask(data);
    }
    async updateGoalTask(goalTaskId, data) {
        return await this.sprintGoalService.updateGoalTask({
            ...data,
            id: goalTaskId,
        });
    }
    async deleteGoalTask(goalTaskId) {
        return await this.sprintGoalService.deleteGoalTask(goalTaskId);
    }
};
exports.SprintGoalController = SprintGoalController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateSprintGoalDto]),
    __metadata("design:returntype", Promise)
], SprintGoalController.prototype, "createGoal", null);
__decorate([
    (0, common_1.Patch)(':goalId'),
    __param(0, (0, common_1.Param)('goalId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateSprintGoalDto]),
    __metadata("design:returntype", Promise)
], SprintGoalController.prototype, "updateGoal", null);
__decorate([
    (0, common_1.Delete)(':goalId'),
    __param(0, (0, common_1.Param)('goalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SprintGoalController.prototype, "deleteGoal", null);
__decorate([
    (0, common_1.Get)(':sprintId'),
    __param(0, (0, common_1.Param)('sprintId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SprintGoalController.prototype, "getSprintGoals", null);
__decorate([
    (0, common_1.Post)('goalTask'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateGoalTaskDto]),
    __metadata("design:returntype", Promise)
], SprintGoalController.prototype, "createGoalTask", null);
__decorate([
    (0, common_1.Patch)('goalTask/:goalTaskId'),
    __param(0, (0, common_1.Param)('goalTaskId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateGoalTaskDto]),
    __metadata("design:returntype", Promise)
], SprintGoalController.prototype, "updateGoalTask", null);
__decorate([
    (0, common_1.Delete)('goalTask/:goalTaskId'),
    __param(0, (0, common_1.Param)('goalTaskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SprintGoalController.prototype, "deleteGoalTask", null);
exports.SprintGoalController = SprintGoalController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('sprint-goals'),
    __metadata("design:paramtypes", [sprint_goal_service_1.SprintGoalService])
], SprintGoalController);
//# sourceMappingURL=sprint-goal.controller.js.map