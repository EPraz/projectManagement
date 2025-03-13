import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Res,
  Req,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from 'src/dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() request: RegisterDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { accessToken, refreshToken } = await this.authService.login(request);

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return { accessToken, refreshToken };
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() request: LoginDto,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(request);

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return { accessToken };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Logged out' };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const refreshToken = req.cookies?.jwt;
    if (!refreshToken)
      throw new UnauthorizedException('No refresh token provided');

    const tokens = await this.authService.refreshToken(refreshToken);

    res.cookie('jwt', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return tokens;
  }

  @UseGuards(JwtAuthGuard)
  @Get('checkAuth')
  async checkAuth(@Req() req: Request) {
    if (!req.user) throw new UnauthorizedException('Not authenticated');
    return req.user;
  }

  @Post('instant-login')
  async instantLogin(
    @Res({ passthrough: true }) res: Response,
    @Body('email') email: string,
  ) {
    if (!email || !email.includes('@')) {
      throw new BadRequestException('Invalid email format');
    }

    const { accessToken, refreshToken } =
      await this.authService.instantLogin(email);

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return { accessToken, refreshToken };
  }
}
