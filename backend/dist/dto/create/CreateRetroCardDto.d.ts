import { RetroCardType } from '@prisma/client';
export declare class CreateRetroCardDto {
    content: string;
    type: RetroCardType;
    authorId: string;
    sprintId: string;
    likedBy: string[];
    likes: number;
}
