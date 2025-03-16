import { UserService } from './user.service';
import { RegisterDto, LoginDto } from 'src/dto';
import { User } from '@prisma/client';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    create(request: RegisterDto): Promise<User | null>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User | null>;
    update(id: string, updateUserDto: LoginDto): Promise<User | null>;
    delete(id: string): Promise<boolean>;
}
