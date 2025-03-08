import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { LoginDto, RegisterDto } from 'src/dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register({
    name,
    email,
    password,
    role,
  }: RegisterDto): Promise<{ accessToken: string; refreshToken: string }> {
    const normalizedEmail = email.toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { name, email: normalizedEmail, password: hashedPassword, role },
    });

    return this.generateTokens(user);
  }

  async login({
    email,
    password,
  }: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const normalizedEmail = email.toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    return this.generateTokens(user);
  }

  async validateUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  async instantLogin(
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: email.split('@')[0], // Nombre basado en email
          email,
          password: await bcrypt.hash(email, 10), // Password generado pero nunca usado
          role: 'DEVELOPER',
        },
      });
    }

    return this.generateTokens(user);
  }

  private async generateTokens(user: User) {
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

    const refreshToken = this.jwtService.sign(
      { id: user.id },
      { expiresIn: '15m' },
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(oldToken: string) {
    const payload = this.jwtService.verify(oldToken);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || user.refreshToken !== oldToken)
      throw new UnauthorizedException();

    return this.generateTokens(user);
  }
}
