import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(
    name: string,
    email: string,
    password: string,
    role: string,
  ): Promise<User> {
    const hashedPassword: string = await bcrypt.hash(password, 10);
    try {
      const newUser: User = await this.prisma.user.create({
        data: { name, email, password: hashedPassword, role },
      });
      return newUser;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new UnauthorizedException(`Error de Prisma: ${error.message}`);
      }
      throw new InternalServerErrorException('Error en el registro');
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user: User | null = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      return user;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new UnauthorizedException(`Error de Prisma: ${error.message}`);
      }
      throw new InternalServerErrorException('Error al validar usuario');
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user: User = await this.validateUser(email, password);
    const payload = { sub: user.id, email: user.email, role: user.role };

    return { access_token: this.jwtService.sign(payload) };
  }
}
