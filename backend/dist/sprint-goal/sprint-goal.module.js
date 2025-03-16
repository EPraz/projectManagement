"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SprintGoalModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const sprint_goal_service_1 = require("./sprint-goal.service");
const sprint_goal_controller_1 = require("./sprint-goal.controller");
const events_gateway_1 = require("../webSockets/events.gateway");
let SprintGoalModule = class SprintGoalModule {
};
exports.SprintGoalModule = SprintGoalModule;
exports.SprintGoalModule = SprintGoalModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [sprint_goal_service_1.SprintGoalService, events_gateway_1.EventsGateway],
        controllers: [sprint_goal_controller_1.SprintGoalController],
    })
], SprintGoalModule);
//# sourceMappingURL=sprint-goal.module.js.map