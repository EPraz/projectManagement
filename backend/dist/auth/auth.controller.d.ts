import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from 'src/dto';
import { Request, Response } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(res: Response, request: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    login(res: Response, request: LoginDto): Promise<{
        accessToken: string;
    }>;
    logout(res: Response): Promise<{
        message: string;
    }>;
    refresh(req: Request, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    checkAuth(req: Request): Promise<Express.User>;
    instantLogin(res: Response, email: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
