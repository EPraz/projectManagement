"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpicStatusModule = void 0;
const common_1 = require("@nestjs/common");
const epic_status_controller_1 = require("./epic-status.controller");
const epic_status_service_1 = require("./epic-status.service");
const prisma_module_1 = require("../prisma/prisma.module");
let EpicStatusModule = class EpicStatusModule {
};
exports.EpicStatusModule = EpicStatusModule;
exports.EpicStatusModule = EpicStatusModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [epic_status_service_1.EpicStatusService],
        controllers: [epic_status_controller_1.EpicStatusController],
    })
], EpicStatusModule);
//# sourceMappingURL=epic-status.module.js.map