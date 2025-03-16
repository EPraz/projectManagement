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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register({ name, email, password, role, }) {
        const normalizedEmail = email.toLowerCase();
        const existingUser = await this.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (existingUser)
            throw new common_1.ConflictException('Email already in use');
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: { name, email: normalizedEmail, password: hashedPassword, role },
        });
        return this.generateTokens(user);
    }
    async login({ email, password, }) {
        const normalizedEmail = email.toLowerCase();
        const user = await this.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return this.generateTokens(user);
    }
    async validateUser(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            return null;
        const { password, ...result } = user;
        return result;
    }
    async instantLogin(email) {
        const normalizedEmail = email.toLowerCase();
        let user = await this.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    name: email.split('@')[0],
                    email: normalizedEmail,
                    password: await bcrypt.hash(email, 10),
                    role: 'DEVELOPER',
                },
            });
        }
        return this.generateTokens(user);
    }
    async generateTokens(user) {
        const accessToken = this.jwtService.sign({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            createdAt: user.createdAt,
            isVerified: user.isVerified,
            refreshToken: user.refreshToken,
            updatedAt: user.updatedAt,
        });
        const refreshToken = this.jwtService.sign({ id: user.id }, { expiresIn: process.env.EXPIRES_IN });
        await this.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });
        return { accessToken, refreshToken };
    }
    async refreshToken(oldToken) {
        const payload = this.jwtService.verify(oldToken);
        const user = await this.prisma.user.findUnique({
            where: { id: payload.id },
        });
        if (!user || user.refreshToken !== oldToken)
            throw new common_1.UnauthorizedException();
        return this.generateTokens(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map