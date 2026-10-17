import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { DEMO_USER_ID } from '../demo/demo.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(id: string) {
    if (id !== DEMO_USER_ID) return null;
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async instantLogin() {
    const user = await this.validateUser(DEMO_USER_ID);
    if (!user)
      throw new ServiceUnavailableException('Demo data is not initialized');
    return {
      accessToken: this.accessToken(),
      // Independent visitor cookies avoid invalidating other visitors' sessions.
      refreshToken: this.jwt.sign(
        { id: user.id, tokenUse: 'refresh', jti: randomUUID() },
        { expiresIn: '7d' },
      ),
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwt.verify<{ id: string; tokenUse: string }>(token);
      if (
        payload.tokenUse !== 'refresh' ||
        !(await this.validateUser(payload.id))
      ) {
        throw new UnauthorizedException();
      }
      return { accessToken: this.accessToken() };
    } catch {
      throw new UnauthorizedException('Invalid demo session');
    }
  }

  private accessToken() {
    return this.jwt.sign(
      { id: DEMO_USER_ID, tokenUse: 'access' },
      { expiresIn: '15m' },
    );
  }
}
