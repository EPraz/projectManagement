import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from 'src/dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register({ name, email, password, role, }: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    login({ email, password, }: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    validateUser(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        refreshToken: string | null;
    } | null>;
    instantLogin(email: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private generateTokens;
    refreshToken(oldToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
