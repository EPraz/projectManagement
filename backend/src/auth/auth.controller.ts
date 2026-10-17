import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    };
  }

  @Post('instant-login')
  async instantLogin(
    @Body() body: Record<string, unknown>,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (Object.keys(body ?? {}).length) {
      throw new BadRequestException(
        'Demo access does not accept personal details',
      );
    }
    const { accessToken, refreshToken } = await this.authService.instantLogin();
    res.cookie('jwt', refreshToken, {
      ...this.cookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken };
  }

  @Post('refresh')
  async refresh(@Req() req: Request) {
    const token: unknown = req.cookies?.jwt;
    if (typeof token !== 'string' || !token)
      throw new UnauthorizedException('No demo session');
    return this.authService.refreshToken(token);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', this.cookieOptions());
    return { message: 'Logged out' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('checkAuth')
  checkAuth(@Req() req: Request) {
    return req.user;
  }
}
