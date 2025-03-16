import { TaskService } from './task.service';
import { CreateTaskDto, GetAllTasksDto, UpdateTaskDto } from 'src/dto';
import { Task } from '@prisma/client';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    create(request: CreateTaskDto): Promise<Task>;
    findAll(request: GetAllTasksDto): Promise<Task[]>;
    findOne(id: number): Promise<Task>;
    update(id: number, request: UpdateTaskDto): Promise<Task>;
    delete(id: number): Promise<boolean>;
}
