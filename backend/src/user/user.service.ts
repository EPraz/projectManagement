import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from 'src/dto';
import { User } from '@prisma/client';
import { handlePrismaError } from 'src/helper';
import { USER_INCLUDE } from 'src/constants';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  public async create(createUserDto: RegisterDto): Promise<User | null> {
    try {
      const normalizedEmail = createUserDto.email.toLowerCase();

      const existingUser = await this.prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }

      return await this.prisma.user.create({
        data: {
          ...createUserDto,
          email: normalizedEmail,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async findAll(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany({
        include: USER_INCLUDE,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async findOne(id: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: USER_INCLUDE,
      });
      if (!user) {
        throw new NotFoundException(`User #${id} not found`);
      }
      return user;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async update(
    id: string,
    updateUserDto: LoginDto,
  ): Promise<User | null> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!existingUser) {
        throw new NotFoundException(`User #${id} not found`);
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
        // include: USER_INCLUDE,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User #${id} not found`);
      }
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
