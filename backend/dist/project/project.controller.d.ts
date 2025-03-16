import { ProjectService } from './project.service';
import { Project, User } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto } from 'src/dto';
import { Request } from 'express';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    create(createProjectDto: CreateProjectDto): Promise<Project | null>;
    findAll(req: Request): Promise<Project[]>;
    findOne(id: string): Promise<Project>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project>;
    remove(id: string): Promise<boolean>;
    assignUser(projectId: string, userId: string): Promise<User[]>;
    removeUser(projectId: string, userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        refreshToken: string | null;
    }[]>;
}
