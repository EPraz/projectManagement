import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from 'src/dto';
import { User } from '@prisma/client';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: RegisterDto): Promise<User | null>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User | null>;
    update(id: string, updateUserDto: LoginDto): Promise<User | null>;
    delete(id: string): Promise<boolean>;
}
