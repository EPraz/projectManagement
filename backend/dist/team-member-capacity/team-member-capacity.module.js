"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMemberCapacityModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const team_member_capacity_service_1 = require("./team-member-capacity.service");
const team_member_capacity_controller_1 = require("./team-member-capacity.controller");
const events_gateway_1 = require("../webSockets/events.gateway");
let TeamMemberCapacityModule = class TeamMemberCapacityModule {
};
exports.TeamMemberCapacityModule = TeamMemberCapacityModule;
exports.TeamMemberCapacityModule = TeamMemberCapacityModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [team_member_capacity_service_1.TeamMemberCapacityService, events_gateway_1.EventsGateway],
        controllers: [team_member_capacity_controller_1.TeamMemberCapacityController],
    })
], TeamMemberCapacityModule);
//# sourceMappingURL=team-member-capacity.module.js.map