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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const helper_1 = require("../helper");
const constants_1 = require("../constants");
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        try {
            const normalizedEmail = createUserDto.email.toLowerCase();
            const existingUser = await this.prisma.user.findUnique({
                where: { email: normalizedEmail },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Email already in use');
            }
            return await this.prisma.user.create({
                data: {
                    ...createUserDto,
                    email: normalizedEmail,
                },
            });
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async findAll() {
        try {
            return await this.prisma.user.findMany({
                include: constants_1.USER_INCLUDE,
            });
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async findOne(id) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id },
                include: constants_1.USER_INCLUDE,
            });
            if (!user) {
                throw new common_1.NotFoundException(`User #${id} not found`);
            }
            return user;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async update(id, updateUserDto) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { id },
            });
            if (!existingUser) {
                throw new common_1.NotFoundException(`User #${id} not found`);
            }
            const data = {
                ...updateUserDto,
                email: updateUserDto.email
                    ? updateUserDto.email.toLowerCase()
                    : undefined,
            };
            return await this.prisma.user.update({
                where: { id },
                data,
            });
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
    async delete(id) {
        try {
            const user = await this.prisma.user.findUnique({ where: { id } });
            if (!user) {
                throw new common_1.NotFoundException(`User #${id} not found`);
            }
            await this.prisma.user.delete({ where: { id } });
            return true;
        }
        catch (error) {
            (0, helper_1.handlePrismaError)(error);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map