import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto, LoginDto } from 'src/dto';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  public async create(@Body() request: RegisterDto): Promise<User | null> {
    return await this.userService.create(request);
  }

  @Get()
  public async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  public async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<User | null> {
    return await this.userService.findOne(id);
  }

  @Put(':id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: LoginDto,
  ): Promise<User | null> {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  public async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<boolean> {
    return await this.userService.delete(id);
  }
}
